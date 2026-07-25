"""
dame_engine.py
==============

A complete, self-contained rules engine for Ghanaian Dame (checkers/draughts)
played on the dark squares of an 8x8 board, with 12 pieces per side and
"flying king" movement.

Board representation
---------------------
Only the 32 dark squares of the 8x8 board are used for play, so the board is
stored as a flat list of 32 cells, indexed 0..31, numbered row-major from the
top-left dark square to the bottom-right dark square (the classic checkers
numbering scheme):

        Row 0:  .  0  .  1  .  2  .  3
        Row 1:  4  .  5  .  6  .  7  .
        Row 2:  .  8  .  9  . 10  . 11
        Row 3: 12  . 13  . 14  . 15  .
        Row 4:  . 16  . 17  . 18  . 19
        Row 5: 20  . 21  . 22  . 23  .
        Row 6:  . 24  . 25  . 26  . 27
        Row 7: 28  . 29  . 30  . 31  .

Player 1 ("South", pieces at the top) starts on squares 0-11 and moves
"forward" toward increasing row numbers (down the board). Player 2 ("North")
starts on squares 20-31 and moves "forward" toward decreasing row numbers
(up the board). This mirrors the standard 8x8 checkers starting layout.

Cell values
-----------
    EMPTY     = 0
    P1_MAN    = 1
    P1_KING   = 2
    P2_MAN    = 3
    P2_KING   = 4

Rules implemented (Ghanaian Dame)
----------------------------------
* Men move one square diagonally forward onto an empty square.
* Men CAPTURE diagonally in any of the four directions (this matches the
  Ghanaian/International-draughts lineage of "Dame", where a man may not
  walk backward but may jump backward to capture). If your local house
  rules restrict men to forward-only captures, flip MAN_CAPTURE_ALL_DIRS
  to False below.
* Capturing is mandatory: if any capture is available anywhere on the
  board for the side to move, only capturing moves are legal.
* Multi-captures are mandatory to continue: once a capture sequence has
  started, the same piece must keep capturing with that piece for as long
  as further captures are available from its current square. The
  "longest sequence" is NOT enforced -- whenever a player has a choice of
  which capture to make (either which piece to start with, or which
  branch to take mid-sequence), any legal choice is allowed, even if a
  longer sequence exists elsewhere.
* A man that reaches the back row (during a normal move or mid-capture)
  is immediately crowned a king. If promotion happens mid-capture, the
  capture sequence ends immediately at that point (the newly crowned king
  does not keep capturing in the same turn).
* Kings are "flying kings": they may move any number of empty squares
  along a diagonal, and capture an opponent piece anywhere along a clear
  diagonal, landing on any empty square beyond it (chosen by the player).
* A single move can never capture the same opponent piece twice.
* Captured pieces are only removed from the board once an entire turn
  (the full capture sequence) is complete; internally, already-captured
  squares are treated as empty for the purposes of computing further
  jumps within the same sequence (this matches real play, where the
  captured piece is lifted off the board only at the end of the turn).

Author: generated for integration into a GUI checkers/draughts application.
"""

from copy import deepcopy
from typing import List, Dict, Tuple, Optional, Set, FrozenSet


# --------------------------------------------------------------------------
# Constants
# --------------------------------------------------------------------------

EMPTY = 0
P1_MAN = 1
P1_KING = 2
P2_MAN = 3
P2_KING = 4

PLAYER_1 = 1
PLAYER_2 = 2

# Diagonal directions, as (delta_row, delta_col)
NW = (-1, -1)
NE = (-1, 1)
SW = (1, -1)
SE = (1, 1)
ALL_DIRECTIONS = (NW, NE, SW, SE)

# Whether ordinary men may capture in ALL four directions (True, matching
# International/Ghanaian draughts lineage) or only their forward
# directions (False, matching classic American checkers). See module
# docstring.
MAN_CAPTURE_ALL_DIRS = True

# Game status strings
STATUS_ONGOING = "ONGOING"
STATUS_P1_WINS = "PLAYER_1_WINS"
STATUS_P2_WINS = "PLAYER_2_WINS"
STATUS_DRAW = "DRAW"

# Number of half-moves (single-player turns) without a capture or a
# promotion after which the game is declared a draw. 40 full moves per
# side (80 half-moves) is a common convention in draughts rule sets.
NO_PROGRESS_DRAW_LIMIT = 80

# Number of times an identical (board, player-to-move) position must
# recur for the game to be declared a draw by repetition.
REPETITION_DRAW_LIMIT = 3


class DameEngine:
    """Rules engine for 8x8 Ghanaian Dame (checkers/draughts).

    The engine is largely stateless with respect to move generation --
    methods like `get_legal_moves` and `apply_move` take a board explicitly
    and return a new board, which makes the engine easy to use for AI
    search (minimax/alpha-beta) as well as for driving a GUI. A small
    amount of *instance* state (`self.board`, `self.current_player`, and
    draw-detection bookkeeping) is kept for convenience when the engine is
    used to run a live game.
    """

    # ---------------------------------------------------------------
    # CONSTRUCTION / GEOMETRY
    # ---------------------------------------------------------------

    def __init__(self):
        # Precompute board geometry (square <-> (row, col), and rays).
        self._build_geometry()

        # Live game state.
        self.board = self.initial_board()
        self.current_player = PLAYER_1
        self.no_progress_count = 0
        self.position_history: Dict[Tuple[Tuple[int, ...], int], int] = {}
        self._record_position()

    def _build_geometry(self) -> None:
        """Builds the square <-> (row, col) mapping and the diagonal ray
        tables used for move/capture generation."""

        self.sq_to_rc: List[Tuple[int, int]] = []
        self.rc_to_sq: Dict[Tuple[int, int], int] = {}

        idx = 0
        for row in range(8):
            for col in range(8):
                if (row + col) % 2 == 1:  # dark square
                    self.sq_to_rc.append((row, col))
                    self.rc_to_sq[(row, col)] = idx
                    idx += 1

        # rays[sq][direction] = ordered list of square indices moving away
        # from `sq` along `direction`, from nearest to farthest.
        self.rays: Dict[int, Dict[Tuple[int, int], List[int]]] = {}
        for sq in range(32):
            row, col = self.sq_to_rc[sq]
            self.rays[sq] = {}
            for d in ALL_DIRECTIONS:
                ray = []
                r, c = row + d[0], col + d[1]
                while 0 <= r < 8 and 0 <= c < 8:
                    nsq = self.rc_to_sq.get((r, c))
                    if nsq is not None:
                        ray.append(nsq)
                    r += d[0]
                    c += d[1]
                self.rays[sq][d] = ray

    # ---------------------------------------------------------------
    # BOARD SETUP / BASIC HELPERS
    # ---------------------------------------------------------------

    @staticmethod
    def initial_board() -> List[int]:
        """Returns a fresh starting board: 12 men per side."""
        board = [EMPTY] * 32
        for i in range(0, 12):
            board[i] = P1_MAN
        for i in range(20, 32):
            board[i] = P2_MAN
        return board

    @staticmethod
    def owner(value: int) -> int:
        """Returns 0 (empty), 1, or 2 depending on which player owns the
        piece occupying a cell value."""
        if value in (P1_MAN, P1_KING):
            return PLAYER_1
        if value in (P2_MAN, P2_KING):
            return PLAYER_2
        return 0

    @staticmethod
    def is_king(value: int) -> bool:
        return value in (P1_KING, P2_KING)

    @staticmethod
    def is_man(value: int) -> bool:
        return value in (P1_MAN, P2_MAN)

    @staticmethod
    def opponent(player: int) -> int:
        return PLAYER_2 if player == PLAYER_1 else PLAYER_1

    def count_pieces(self, board: List[int]) -> Tuple[int, int]:
        """Returns (num_player1_pieces, num_player2_pieces)."""
        p1 = sum(1 for v in board if self.owner(v) == PLAYER_1)
        p2 = sum(1 for v in board if self.owner(v) == PLAYER_2)
        return p1, p2

    def forward_directions(self, player: int) -> Tuple[Tuple[int, int], ...]:
        """Directions a MAN of `player` may make a *non-capturing* move in."""
        return (SW, SE) if player == PLAYER_1 else (NW, NE)

    def is_promotion_square(self, sq: int, player: int) -> bool:
        """True if landing on `sq` promotes a man belonging to `player`."""
        row, _ = self.sq_to_rc[sq]
        return row == 7 if player == PLAYER_1 else row == 0

    def king_value_for(self, player: int) -> int:
        return P1_KING if player == PLAYER_1 else P2_KING

    def man_value_for(self, player: int) -> int:
        return P1_MAN if player == PLAYER_1 else P2_MAN

    # ---------------------------------------------------------------
    # MOVE OBJECT
    # ---------------------------------------------------------------
    #
    # A move is represented as a plain dict so it is trivial to serialize
    # to JSON for a GUI/front-end:
    #
    #   Simple (non-capturing) move:
    #       {
    #           "type": "move",
    #           "from": <int>,
    #           "to": <int>,
    #       }
    #
    #   Capture move (possibly a multi-jump sequence):
    #       {
    #           "type": "capture",
    #           "from": <int>,
    #           "to": <int>,                # final landing square
    #           "path": [<int>, ...],       # landing square after each jump
    #           "captured": [<int>, ...],   # squares of captured pieces,
    #                                        # in the order they were jumped
    #           "promotion": <bool>,        # True if the piece was crowned
    #                                        # during this move
    #       }

    def _make_simple_move(self, src: int, dest: int) -> Dict:
        return {"type": "move", "from": src, "to": dest}

    def _make_capture_move(self, src: int, path: List[int],
                            captured: List[int], promotion: bool) -> Dict:
        return {
            "type": "capture",
            "from": src,
            "to": path[-1],
            "path": list(path),
            "captured": list(captured),
            "promotion": promotion,
        }

    # ---------------------------------------------------------------
    # MOVE GENERATION -- PUBLIC API
    # ---------------------------------------------------------------

    def get_legal_moves(self, board: List[int], player: int) -> List[Dict]:
        """Returns the full list of legal moves for `player` on `board`.

        Enforces mandatory capture: if ANY capturing move exists for the
        player anywhere on the board, only capturing moves are returned.
        Per the Ghanaian house-rule specified, the "longest sequence" rule
        is NOT enforced -- every maximal capture sequence (one that cannot
        be extended further) is offered as a distinct legal option.
        """
        captures: List[Dict] = []
        for sq in range(32):
            piece = board[sq]
            if self.owner(piece) != player:
                continue
            captures.extend(
                self._find_capture_sequences(
                    board=board,
                    current_sq=sq,
                    start_sq=sq,
                    is_king=self.is_king(piece),
                    player=player,
                    captured_so_far=frozenset(),
                    path_so_far=(),
                )
            )

        if captures:
            return captures

        moves: List[Dict] = []
        for sq in range(32):
            piece = board[sq]
            if self.owner(piece) != player:
                continue
            moves.extend(self._simple_moves_for_piece(board, sq, piece, player))
        return moves

    def get_legal_moves_from(self, board: List[int], player: int,
                              src: int) -> List[Dict]:
        """Convenience helper for a GUI: given the player has clicked on
        the piece at `src`, returns only the legal moves starting there
        (respecting mandatory capture across the whole board)."""
        return [m for m in self.get_legal_moves(board, player) if m["from"] == src]

    # ---------------------------------------------------------------
    # MOVE GENERATION -- SIMPLE (NON-CAPTURING) MOVES
    # ---------------------------------------------------------------

    def _simple_moves_for_piece(self, board: List[int], sq: int, piece: int,
                                 player: int) -> List[Dict]:
        moves = []
        if self.is_king(piece):
            for d in ALL_DIRECTIONS:
                for target in self.rays[sq][d]:
                    if board[target] == EMPTY:
                        moves.append(self._make_simple_move(sq, target))
                    else:
                        break  # ray blocked, stop scanning this direction
        else:
            for d in self.forward_directions(player):
                ray = self.rays[sq][d]
                if ray and board[ray[0]] == EMPTY:
                    moves.append(self._make_simple_move(sq, ray[0]))
        return moves

    # ---------------------------------------------------------------
    # MOVE GENERATION -- CAPTURES (recursive, handles multi-jump)
    # ---------------------------------------------------------------

    def _effective_value(self, board: List[int], sq: int,
                          captured_so_far: FrozenSet[int]) -> int:
        """Returns the board value at `sq`, treating any square already
        captured earlier in the current sequence as EMPTY (its piece is
        logically gone, even though it is not physically removed from
        `board` until the whole turn is committed)."""
        if sq in captured_so_far:
            return EMPTY
        return board[sq]

    def _man_capture_jumps(self, board: List[int], sq: int, player: int,
                            captured_so_far: FrozenSet[int]
                            ) -> List[Tuple[int, int]]:
        """Returns a list of (landing_square, captured_square) pairs for a
        MAN sitting at `sq`."""
        results = []
        directions = ALL_DIRECTIONS if MAN_CAPTURE_ALL_DIRS else self.forward_directions(player)
        for d in directions:
            ray = self.rays[sq][d]
            if len(ray) < 2:
                continue  # not enough room on the board for a jump
            over_sq, land_sq = ray[0], ray[1]
            over_val = self._effective_value(board, over_sq, captured_so_far)
            land_val = self._effective_value(board, land_sq, captured_so_far)
            if self.owner(over_val) == self.opponent(player) and land_val == EMPTY \
                    and over_sq not in captured_so_far:
                results.append((land_sq, over_sq))
        return results

    def _king_capture_jumps(self, board: List[int], sq: int, player: int,
                             captured_so_far: FrozenSet[int]
                             ) -> List[Tuple[int, int]]:
        """Returns a list of (landing_square, captured_square) pairs for a
        FLYING KING sitting at `sq`. For each direction, finds the first
        actual piece along the ray (skipping squares already captured
        this sequence, which are treated as empty); if it belongs to the
        opponent, every empty square beyond it (up to the next obstacle)
        is a valid landing square."""
        results = []
        for d in ALL_DIRECTIONS:
            ray = self.rays[sq][d]
            i = 0
            # Skip empty squares (including "logically empty" already
            # captured squares) to find the first real obstacle.
            while i < len(ray) and self._effective_value(board, ray[i], captured_so_far) == EMPTY:
                i += 1
            if i >= len(ray):
                continue  # nothing on this diagonal at all
            target_sq = ray[i]
            target_val = self._effective_value(board, target_sq, captured_so_far)
            if self.owner(target_val) != self.opponent(player):
                continue  # own piece (or already-captured square) blocks the ray
            # Collect every empty square immediately beyond the target,
            # stopping at the next obstacle.
            j = i + 1
            while j < len(ray) and self._effective_value(board, ray[j], captured_so_far) == EMPTY:
                results.append((ray[j], target_sq))
                j += 1
        return results

    def _find_capture_sequences(self, board: List[int], current_sq: int,
                                 start_sq: int, is_king: bool, player: int,
                                 captured_so_far: FrozenSet[int],
                                 path_so_far: Tuple[int, ...]) -> List[Dict]:
        """Recursively explores all maximal capture sequences starting at
        `start_sq`, currently having reached `current_sq` after capturing
        the squares in `captured_so_far` (with landing history
        `path_so_far`). A sequence is "maximal" (i.e. complete/terminal)
        once no further capture is available from `current_sq` -- players
        are never forced onto one *particular* maximal sequence, but they
        may never stop short of a maximal one (mandatory multi-capture)."""

        if is_king:
            jumps = self._king_capture_jumps(board, current_sq, player, captured_so_far)
        else:
            jumps = self._man_capture_jumps(board, current_sq, player, captured_so_far)

        if not jumps:
            if path_so_far:
                # Terminal node of a (possibly length-1) capture sequence.
                return [self._make_capture_move(start_sq, list(path_so_far),
                                                 sorted(captured_so_far),
                                                 promotion=False)]
            return []  # no captures at all from the starting square

        sequences: List[Dict] = []
        for land_sq, cap_sq in jumps:
            new_captured = captured_so_far | {cap_sq}
            new_path = path_so_far + (land_sq,)

            # A man that lands on the promotion row stops immediately,
            # even if further captures would otherwise be available.
            if not is_king and self.is_promotion_square(land_sq, player):
                sequences.append(self._make_capture_move(
                    start_sq, list(new_path), sorted(new_captured), promotion=True))
                continue

            sequences.extend(self._find_capture_sequences(
                board, land_sq, start_sq, is_king, player,
                new_captured, new_path))

        return sequences

    # ---------------------------------------------------------------
    # MOVE VALIDATION
    # ---------------------------------------------------------------

    def is_valid_move(self, board: List[int], move: Dict, player: int) -> bool:
        """Checks whether `move` is one of the legal moves for `player`
        on `board` (mandatory capture is enforced automatically because
        `get_legal_moves` only returns captures when captures exist)."""
        if not isinstance(move, dict) or "type" not in move:
            return False

        legal = self.get_legal_moves(board, player)
        for m in legal:
            if m["type"] != move.get("type"):
                continue
            if m["from"] != move.get("from") or m["to"] != move.get("to"):
                continue
            if m["type"] == "capture":
                if set(m["captured"]) != set(move.get("captured", [])):
                    continue
            return True
        return False

    # ---------------------------------------------------------------
    # APPLYING MOVES
    # ---------------------------------------------------------------

    def apply_move(self, board: List[int], move: Dict) -> List[int]:
        """Returns a NEW board with `move` applied. Does not validate the
        move; call `is_valid_move` first if the move's legality is not
        already guaranteed (e.g. it came from `get_legal_moves`)."""
        new_board = board[:]
        piece = new_board[move["from"]]
        player = self.owner(piece)
        new_board[move["from"]] = EMPTY

        if move["type"] == "move":
            new_board[move["to"]] = piece
            if self.is_man(piece) and self.is_promotion_square(move["to"], player):
                new_board[move["to"]] = self.king_value_for(player)

        elif move["type"] == "capture":
            for cap_sq in move["captured"]:
                new_board[cap_sq] = EMPTY
            if move.get("promotion"):
                piece = self.king_value_for(player)
            new_board[move["to"]] = piece

        else:
            raise ValueError(f"Unknown move type: {move['type']!r}")

        return new_board

    # ---------------------------------------------------------------
    # WIN / DRAW DETECTION
    # ---------------------------------------------------------------

    def get_status(self, board: List[int], player_to_move: int) -> str:
        """Returns one of STATUS_ONGOING, STATUS_P1_WINS, STATUS_P2_WINS,
        STATUS_DRAW for `board`, given it is `player_to_move`'s turn.

        Note: draw-by-repetition and draw-by-no-progress require the
        instance's running history (`self.position_history` /
        `self.no_progress_count`), so those two conditions are only
        checked by `is_game_over()` on the *live* game, not by this
        stateless helper. This method covers the two unconditional
        endings: no pieces left, and no legal moves available.
        """
        p1_count, p2_count = self.count_pieces(board)
        if p1_count == 0:
            return STATUS_P2_WINS
        if p2_count == 0:
            return STATUS_P1_WINS

        if not self.get_legal_moves(board, player_to_move):
            # A player who cannot move (blocked, not just piece-less)
            # loses immediately.
            return STATUS_P2_WINS if player_to_move == PLAYER_1 else STATUS_P1_WINS

        return STATUS_ONGOING

    # ---------------------------------------------------------------
    # LIVE-GAME CONVENIENCE API (stateful wrapper around the above)
    # ---------------------------------------------------------------

    def _record_position(self) -> None:
        key = (tuple(self.board), self.current_player)
        self.position_history[key] = self.position_history.get(key, 0) + 1

    def reset(self) -> None:
        self.board = self.initial_board()
        self.current_player = PLAYER_1
        self.no_progress_count = 0
        self.position_history = {}
        self._record_position()

    def legal_moves(self) -> List[Dict]:
        """Legal moves for the current player in the live game."""
        return self.get_legal_moves(self.board, self.current_player)

    def make_move(self, move: Dict) -> bool:
        """Applies `move` to the live game if legal. Returns True on
        success, False if the move was illegal (state is left unchanged)."""
        if not self.is_valid_move(self.board, move, self.current_player):
            return False

        is_progress = (move["type"] == "capture") or move.get("promotion", False)

        self.board = self.apply_move(self.board, move)
        self.current_player = self.opponent(self.current_player)

        self.no_progress_count = 0 if is_progress else self.no_progress_count + 1
        self._record_position()
        return True

    def is_game_over(self) -> bool:
        return self.get_live_status() != STATUS_ONGOING

    def get_live_status(self) -> str:
        """Full status of the live game, including draw conditions that
        depend on move history (no-progress count, repetition)."""
        status = self.get_status(self.board, self.current_player)
        if status != STATUS_ONGOING:
            return status

        if self.no_progress_count >= NO_PROGRESS_DRAW_LIMIT:
            return STATUS_DRAW

        key = (tuple(self.board), self.current_player)
        if self.position_history.get(key, 0) >= REPETITION_DRAW_LIMIT:
            return STATUS_DRAW

        return STATUS_ONGOING

    def get_winner(self) -> Optional[int]:
        """Returns PLAYER_1, PLAYER_2, or None (ongoing or draw)."""
        status = self.get_live_status()
        if status == STATUS_P1_WINS:
            return PLAYER_1
        if status == STATUS_P2_WINS:
            return PLAYER_2
        return None

    # ---------------------------------------------------------------
    # AI OPPONENT (minimax with alpha-beta pruning)
    # ---------------------------------------------------------------
    #
    # Scores are always expressed from PLAYER_1's point of view: positive
    # is good for player 1, negative is good for player 2. This keeps the
    # minimax implementation simple (no need to flip sign conventions
    # per-node) at the small cost of `best_move` picking max/min depending
    # on whose turn it is.

    # Tunable evaluation weights.
    EVAL_MAN_WEIGHT = 1.0
    EVAL_KING_WEIGHT = 1.75
    EVAL_ADVANCEMENT_WEIGHT = 0.05   # reward men for advancing toward promotion
    EVAL_CENTER_WEIGHT = 0.03        # small reward for controlling central files

    def evaluate(self, board: List[int]) -> float:
        """A simple static evaluation of `board`, positive-good-for-P1."""
        score = 0.0
        for sq in range(32):
            v = board[sq]
            if v == EMPTY:
                continue
            row, col = self.sq_to_rc[sq]
            center_bonus = self.EVAL_CENTER_WEIGHT * (3 - abs(col - 3.5))

            if v == P1_MAN:
                score += self.EVAL_MAN_WEIGHT
                score += self.EVAL_ADVANCEMENT_WEIGHT * row
                score += center_bonus
            elif v == P1_KING:
                score += self.EVAL_KING_WEIGHT
                score += center_bonus
            elif v == P2_MAN:
                score -= self.EVAL_MAN_WEIGHT
                score -= self.EVAL_ADVANCEMENT_WEIGHT * (7 - row)
                score -= center_bonus
            elif v == P2_KING:
                score -= self.EVAL_KING_WEIGHT
                score -= center_bonus

        return score

    def _minimax(self, board: List[int], player: int, depth: int,
                 alpha: float, beta: float) -> float:
        """Returns the minimax value of `board` (from PLAYER_1's
        perspective) with `player` to move, searching `depth` plies
        further with alpha-beta pruning."""
        moves = self.get_legal_moves(board, player)

        if not moves:
            # `player` has no legal move and therefore loses immediately.
            # Use a large-but-finite score (scaled by depth so a quicker
            # forced win is preferred over a slower one).
            return -10000.0 - depth if player == PLAYER_1 else 10000.0 + depth

        if depth == 0:
            return self.evaluate(board)

        if player == PLAYER_1:
            best = float("-inf")
            for m in moves:
                child = self.apply_move(board, m)
                val = self._minimax(child, PLAYER_2, depth - 1, alpha, beta)
                best = max(best, val)
                alpha = max(alpha, best)
                if beta <= alpha:
                    break  # beta cutoff
            return best
        else:
            best = float("inf")
            for m in moves:
                child = self.apply_move(board, m)
                val = self._minimax(child, PLAYER_1, depth - 1, alpha, beta)
                best = min(best, val)
                beta = min(beta, best)
                if beta <= alpha:
                    break  # alpha cutoff
            return best

    def best_move(self, board: List[int], player: int, depth: int = 5) -> Optional[Dict]:
        """Returns the AI's chosen move for `player` on `board`, searching
        `depth` plies ahead with minimax + alpha-beta pruning. Returns
        None if `player` has no legal moves."""
        moves = self.get_legal_moves(board, player)
        if not moves:
            return None
        if len(moves) == 1:
            return moves[0]  # no choice to make -- skip the search entirely

        alpha, beta = float("-inf"), float("inf")
        best_move_found = None

        if player == PLAYER_1:
            best_val = float("-inf")
            for m in moves:
                child = self.apply_move(board, m)
                val = self._minimax(child, PLAYER_2, depth - 1, alpha, beta)
                if val > best_val:
                    best_val = val
                    best_move_found = m
                alpha = max(alpha, best_val)
        else:
            best_val = float("inf")
            for m in moves:
                child = self.apply_move(board, m)
                val = self._minimax(child, PLAYER_1, depth - 1, alpha, beta)
                if val < best_val:
                    best_val = val
                    best_move_found = m
                beta = min(beta, best_val)

        return best_move_found

    def make_ai_move(self, depth: int = 5) -> bool:
        """Computes and applies the AI's move for the CURRENT LIVE player.
        Returns True if a move was made, False if there was no legal move
        (i.e. the game was already over)."""
        move = self.best_move(self.board, self.current_player, depth=depth)
        if move is None:
            return False
        return self.make_move(move)