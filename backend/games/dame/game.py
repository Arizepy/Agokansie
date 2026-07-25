from games.base_game import BaseGame

from games.dame.engine import (
    DameEngine,
    PLAYER_1,
    PLAYER_2,
    STATUS_ONGOING,
    STATUS_P1_WINS,
    STATUS_P2_WINS,
    STATUS_DRAW,
)
from games.dame.vision import DameVision

import random


class DameGame(BaseGame):

    def __init__(self):

        super().__init__("dame")

        self.engine = DameEngine()

        self.vision = DameVision()

        # Engine owns the board
        self.engine.board = self.engine.initial_board()

        self.board_state = self.engine.board

        self.ai_player = PLAYER_1
        self.human_player = PLAYER_2
        self.current_player = self.ai_player

        self.search_depth = 8

    # =====================================================
    # VISION
    # =====================================================

    def scan_board(self):

        board = self.vision.scan_board()

        self.engine.board = board
        self.board_state = board

        return board

    # =====================================================
    # HUMAN MOVE DETECTION
    # =====================================================

    def detect_human_move(self, scanned_board):
        self.current_player=self.human_player
        if self.current_player != self.human_player:
            return None

        return self.find_move_from_board(
            scanned_board
        )

    def find_move_from_board(self, scanned_board):

        """
        Compare the stored board with a newly scanned board and
        determine the human move. Unlike Achi, a single Dame move can
        remove several opposing pieces at once (a multi-jump capture),
        so this looks for exactly one square where the human's piece
        disappeared (the origin), exactly one square where it appeared
        (the destination), and any number of squares where the AI's
        pieces disappeared (captures picked up along the way).

        Note: the board diff alone cannot recover the intermediate
        squares visited during a multi-jump (only the physical piece's
        start and end positions are observable), but the engine does not
        need that path to validate or apply the move -- only the final
        `from`, `to`, and `captured` set matter.
        """

        if self.board_state is None:
            return None

        old_board = self.board_state
        new_board = scanned_board

        start = None
        end = None
        captured = []

        for i in range(32):

            before = old_board[i]
            after = new_board[i]

            if before == after:
                continue

            # Piece removed
            if self.engine.owner(before) == self.human_player and after == 0:
                start = i

            # Piece placed
            elif before == 0 and self.engine.owner(after) == self.human_player:
                end = i

            # Opponent piece removed along the way (capture)
            elif self.engine.owner(before) == self.ai_player and after == 0:
                captured.append(i)

        if start is None or end is None:
            return None

        promotion = (
            self.engine.is_man(old_board[start])
            and self.engine.is_king(new_board[end])
        )

        if captured:
            move = {
                "type": "capture",
                "from": start,
                "to": end,
                "captured": captured,
                "promotion": promotion,
            }
        else:
            move = {
                "type": "move",
                "from": start,
                "to": end,
                "promotion": promotion,
            }

        return move

    # =====================================================
    # AI
    # =====================================================

    def get_best_move(self, board_state):
        # self.current_player=self.ai_player
        if self.current_player != self.ai_player:
            # print("im not equal")
            return None

        self.engine.board = board_state

        self.board_state = board_state

        # DameEngine.best_move already returns a move in the engine's
        # native dict format ({"type", "from", "to", "captured", ...}),
        # so -- unlike TapatanEngine's tuple moves -- no reformatting is
        # needed here.
        move = self.engine.best_move(
            self.engine.board,
            self.ai_player,
            self.search_depth
        )

        return move

    # =====================================================
    # RULES
    # =====================================================

    def validate_move(self, move, player=None):

        if player is None:

            player = self.ai_player

        if move is None:

            return False

        return self.engine.is_valid_move(

            self.engine.board,

            move,

            player
        )

    # =====================================================
    # APPLY MOVE
    # =====================================================

    def apply_move(self, move, player=None):

        if player is None:

            player = self.ai_player

        print(move)

        # DameEngine.apply_move infers the moving player from the piece
        # sitting on `move["from"]`, so it doesn't take a player arg.
        self.engine.board = self.engine.apply_move(

            self.engine.board,

            move
        )

        self.board_state = self.engine.board

        self.current_player = (
            self.human_player
            if player == self.ai_player
            else self.ai_player
        )

        return self.engine.board

    # =====================================================
    # GAME OVER
    # =====================================================

    def is_game_over(self):

        status = self.engine.get_status(
            self.engine.board,
            self.current_player
        )

        return status != STATUS_ONGOING

    def get_winner(self):

        status = self.engine.get_status(
            self.engine.board,
            self.current_player
        )

        if status == STATUS_DRAW:
            return "draw"

        if status == STATUS_P1_WINS:
            winner_player = PLAYER_1
        elif status == STATUS_P2_WINS:
            winner_player = PLAYER_2
        else:
            return None

        if winner_player == self.ai_player:

            return "robot"

        if winner_player == self.human_player:

            return "human"

        return None

    # =====================================================
    # PHASE
    # =====================================================

    def get_phase(self):

        """
        Dame has no separate placement phase (all 24 pieces start on the
        board), so "phase" instead reports whether the side to move is
        currently under mandatory capture -- useful for the UI/robot to
        highlight forced moves the way Achi's phase flag drives its own
        placement/movement UI.
        """

        moves = self.engine.get_legal_moves(
            self.engine.board,
            self.current_player
        )

        if moves and moves[0]["type"] == "capture":
            return "capture"

        return "movement"

    # =====================================================
    # ROBOT MOVE
    # =====================================================

    def get_robot_move(self, board_state):

        if self.current_player != self.ai_player:
            return None

        move = self.get_best_move(
            board_state
        )

        if move is None:
            print("did not")
            return None  

        # print(move)

        data = {
            "type": move["type"],
            "from": move["from"],
            "to": move["to"],
        }

        if move["type"] == "capture":
            data["captured"] = move["captured"]

        if move.get("promotion"):
            data["promotion"] = True

        return {
            "type": "dame_action",
            "action": move["type"],
            "data": data
        }

    # =====================================================
    # BOARD COORDINATES
    # =====================================================

    # NOTE: these four numbers are placeholders and MUST be calibrated
    # against your real physical board before use with a robot arm.
    # ORIGIN_X / ORIGIN_Y is the (x, y) position of dark-square (row=0,
    # col=1) -- the top-left playable square -- and STEP_X / STEP_Y is
    # the physical distance between adjacent square centers.
    ORIGIN_X = 50
    ORIGIN_Y = 180
    STEP_X = 25
    STEP_Y = -25

    def map_to_coordinates(self, position):

        """
        Converts a Dame square index (0-31) into physical (x, y)
        coordinates for the robot arm, using DameEngine's row/col
        geometry. Recalibrate ORIGIN_X/Y and STEP_X/Y (or replace this
        with a lookup table, as Achi does) to match your actual board.
        """

        row, col = self.engine.sq_to_rc[position]
        # print(row,col)
        print(position)

        x = self.ORIGIN_X + (col * self.STEP_X)+25
        y = self.ORIGIN_Y + (row * self.STEP_Y)
        print(x,y,"this x and y")
        return (x, y)

    # =====================================================
    # ROBOT COMMAND
    # =====================================================

    def convert_to_robot_command(self, move):

        if move is None:

            return None

        command = {

            "action": move["type"],

            "source":
                self.map_to_coordinates(
                    move["from"]
                ),

            "destination":
                self.map_to_coordinates(
                    move["to"]
                )

        }

        if move["type"] == "capture":

            command["removals"] = [
                self.map_to_coordinates(sq)
                for sq in move["captured"]
            ]

        if move.get("promotion"):

            command["promotion"] = True

        return command

    # =====================================================
    # STATE
    # =====================================================

    def get_state(self):

        return {

            "game": self.name,

            "board": self.engine.board,

            "phase": self.get_phase(),

            "current_player": (
                "robot"
                if self.current_player == self.ai_player
                else "human"
            ),

            "winner": self.get_winner(),

            "ratings": random.randint(0, 1),

            "game_over": self.is_game_over()

        }

    # =====================================================
    # RESET
    # =====================================================

    def reset(self):

        self.engine = DameEngine()

        self.engine.board = self.engine.initial_board()

        self.current_player = self.ai_player

        self.board_state = self.engine.board