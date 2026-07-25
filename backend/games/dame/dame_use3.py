"""
dame_gui.py
===========

A Pygame front-end for playing Ghanaian Dame (checkers) using the rules
engine + AI in `dame_engine.py`.

At launch you get a small menu:
    1 - Play vs AI (Easy)
    2 - Play vs AI (Medium)
    3 - Play vs AI (Hard)
    H - Two-player hot-seat (no AI)

You always play White (Player 1, the cream pieces) and move first when
playing against the AI.

Controls (in-game)
-------------------
* Click a piece belonging to the player to move -> its legal destination
  squares are highlighted.
* Click one of the highlighted squares to move there (a highlighted
  square that is a capture will automatically play the *entire* forced
  capture sequence, including multi-jumps).
* Click the selected piece again to deselect.
* Press R to restart with the same settings.
* Press M to return to the menu (choose a different mode/difficulty).
* Press Esc / close the window to quit.

Run with:  python3 dame_gui.py
(Requires `pygame`: pip install pygame)
"""

import sys
import pygame

from engine import (
    DameEngine, PLAYER_1, PLAYER_2,
    STATUS_ONGOING, STATUS_P1_WINS, STATUS_P2_WINS,
)

# --------------------------------------------------------------------------
# Layout / appearance constants
# --------------------------------------------------------------------------

SQUARE = 80                       # pixel size of one board square
BOARD_PIXELS = SQUARE * 8
STATUS_HEIGHT = 60
WIDTH = BOARD_PIXELS
HEIGHT = BOARD_PIXELS + STATUS_HEIGHT
FPS = 30

COLOR_LIGHT_SQ = (238, 218, 179)
COLOR_DARK_SQ = (101, 67, 33)
COLOR_STATUS_BG = (30, 30, 30)
COLOR_STATUS_TEXT = (240, 240, 240)
COLOR_MENU_BG = (25, 25, 30)
COLOR_MENU_TEXT = (235, 235, 235)
COLOR_MENU_HILITE = (250, 200, 90)

COLOR_P1_PIECE = (250, 250, 245)      # cream / "white" pieces -- always YOU
COLOR_P1_OUTLINE = (60, 60, 60)
COLOR_P2_PIECE = (40, 40, 40)         # near-black pieces
COLOR_P2_OUTLINE = (200, 200, 200)

COLOR_SELECTED = (60, 160, 250)
COLOR_DEST_MOVE = (80, 200, 120)
COLOR_DEST_CAPTURE = (230, 90, 70)
COLOR_MUST_CAPTURE = (230, 90, 70)

PIECE_RADIUS = SQUARE // 2 - 8
KING_MARK_RADIUS = 8

HUMAN_PLAYER = PLAYER_1   # you are always White and always move first

# Difficulty presets: search depth passed to the AI's minimax.
DIFFICULTY_DEPTH = {"EASY": 2, "MEDIUM": 5, "HARD": 8}


class DameGUI:
    """Owns the Pygame window, the menu state, and translates mouse input
    into engine moves. Also drives the AI's turn when playing vs computer."""

    def __init__(self):
        pygame.init()
        pygame.display.set_caption("Ghanaian Dame")
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont(None, 26)
        self.big_font = pygame.font.SysFont(None, 40)

        self.engine = DameEngine()
        self._reset_selection()

        self.mode = "MENU"        # "MENU" or "PLAYING"
        self.vs_ai = True
        self.ai_depth = DIFFICULTY_DEPTH["MEDIUM"]
        self.ai_pending = False   # True on frames where the AI still needs to move

    def _reset_selection(self):
        self.selected_sq = None
        self.dest_moves = {}      # destination_square -> [move dict, ...]

    def start_game(self, vs_ai: bool, depth: int = None):
        self.vs_ai = vs_ai
        if depth is not None:
            self.ai_depth = depth
        self.engine.reset()
        self._reset_selection()
        self.ai_pending = False
        self.mode = "PLAYING"

    # ------------------------------------------------------------
    # Coordinate helpers
    # ------------------------------------------------------------

    def sq_to_pixel_center(self, sq):
        row, col = self.engine.sq_to_rc[sq]
        x = col * SQUARE + SQUARE // 2
        y = row * SQUARE + SQUARE // 2
        return x, y

    def pixel_to_sq(self, pos):
        x, y = pos
        if y >= BOARD_PIXELS:
            return None
        col = x // SQUARE
        row = y // SQUARE
        if (row + col) % 2 != 1:
            return None
        return self.engine.rc_to_sq.get((row, col))

    # ------------------------------------------------------------
    # Input handling
    # ------------------------------------------------------------

    def handle_click(self, pos):
        if self.engine.is_game_over():
            return
        if self.vs_ai and self.engine.current_player != HUMAN_PLAYER:
            return  # not the human's turn (AI thinking / about to move)

        sq = self.pixel_to_sq(pos)
        if sq is None:
            return

        board = self.engine.board
        player = self.engine.current_player
        piece = board[sq]

        if self.selected_sq is None:
            if self.engine.owner(piece) == player:
                self._select(sq)
            return

        if sq == self.selected_sq:
            self._reset_selection()
            return

        if sq in self.dest_moves:
            move = self.dest_moves[sq][0]
            self.engine.make_move(move)
            self._reset_selection()
            self._maybe_flag_ai_turn()
            return

        if self.engine.owner(piece) == player:
            self._select(sq)
            return

    def _select(self, sq):
        moves = self.engine.get_legal_moves_from(self.engine.board,
                                                   self.engine.current_player, sq)
        if not moves:
            self._reset_selection()
            return
        self.selected_sq = sq
        self.dest_moves = {}
        for m in moves:
            self.dest_moves.setdefault(m["to"], []).append(m)

    def _maybe_flag_ai_turn(self):
        """Called right after a move is applied: if it's now the AI's
        turn, mark that an AI move needs to be computed on an upcoming
        frame (so a 'thinking' frame can render first, instead of
        freezing the window while minimax runs)."""
        if self.vs_ai and not self.engine.is_game_over() \
                and self.engine.current_player != HUMAN_PLAYER:
            self.ai_pending = True

    def do_ai_move_if_pending(self):
        if not self.ai_pending:
            return
        # Render one frame with a "thinking" overlay before the (blocking)
        # search runs, so the player gets feedback instead of a freeze.
        self.draw(thinking=True)
        pygame.display.flip()

        self.engine.make_ai_move(depth=self.ai_depth)
        self.ai_pending = False
        self._reset_selection()

    # ------------------------------------------------------------
    # Drawing -- menu
    # ------------------------------------------------------------

    def draw_menu(self):
        self.screen.fill(COLOR_MENU_BG)
        title = self.big_font.render("Ghanaian Dame", True, COLOR_MENU_HILITE)
        self.screen.blit(title, (WIDTH // 2 - title.get_width() // 2, 60))

        lines = [
            "1  -  Play vs AI (Easy)",
            "2  -  Play vs AI (Medium)",
            "3  -  Play vs AI (Hard)",
            "H  -  Two Player (hot-seat)",
            "",
            "You play White and move first.",
        ]
        y = 160
        for line in lines:
            surf = self.font.render(line, True, COLOR_MENU_TEXT)
            self.screen.blit(surf, (WIDTH // 2 - surf.get_width() // 2, y))
            y += 36

        pygame.display.flip()

    # ------------------------------------------------------------
    # Drawing -- game
    # ------------------------------------------------------------

    def draw_board(self):
        for row in range(8):
            for col in range(8):
                color = COLOR_DARK_SQ if (row + col) % 2 == 1 else COLOR_LIGHT_SQ
                rect = (col * SQUARE, row * SQUARE, SQUARE, SQUARE)
                pygame.draw.rect(self.screen, color, rect)

        if self.selected_sq is not None:
            row, col = self.engine.sq_to_rc[self.selected_sq]
            rect = (col * SQUARE, row * SQUARE, SQUARE, SQUARE)
            pygame.draw.rect(self.screen, COLOR_SELECTED, rect, width=4)

    def draw_pieces(self):
        legal_now = self.engine.legal_moves()
        must_capture_from = {m["from"] for m in legal_now if m["type"] == "capture"}

        for sq in range(32):
            piece = self.engine.board[sq]
            if piece == 0:
                continue
            x, y = self.sq_to_pixel_center(sq)
            owner = self.engine.owner(piece)
            if owner == PLAYER_1:
                fill, outline = COLOR_P1_PIECE, COLOR_P1_OUTLINE
            else:
                fill, outline = COLOR_P2_PIECE, COLOR_P2_OUTLINE

            pygame.draw.circle(self.screen, fill, (x, y), PIECE_RADIUS)
            pygame.draw.circle(self.screen, outline, (x, y), PIECE_RADIUS, width=3)

            if self.engine.is_king(piece):
                pygame.draw.circle(self.screen, outline, (x, y), KING_MARK_RADIUS)

            if sq in must_capture_from:
                pygame.draw.circle(self.screen, COLOR_MUST_CAPTURE, (x, y),
                                    PIECE_RADIUS + 4, width=3)

    def draw_destinations(self):
        for dest_sq, moves in self.dest_moves.items():
            x, y = self.sq_to_pixel_center(dest_sq)
            color = COLOR_DEST_CAPTURE if moves[0]["type"] == "capture" else COLOR_DEST_MOVE
            pygame.draw.circle(self.screen, color, (x, y), 12)

    def draw_status_bar(self, thinking=False):
        rect = (0, BOARD_PIXELS, WIDTH, STATUS_HEIGHT)
        pygame.draw.rect(self.screen, COLOR_STATUS_BG, rect)

        status = self.engine.get_live_status()
        if thinking:
            text = "AI is thinking..."
        elif status == STATUS_ONGOING:
            if self.vs_ai:
                text = "Your move" if self.engine.current_player == HUMAN_PLAYER else "AI's move"
            else:
                name = "White" if self.engine.current_player == PLAYER_1 else "Black"
                text = f"{name} to move"
            if any(m["type"] == "capture" for m in self.engine.legal_moves()):
                text += "  (capture available -- mandatory)"
        elif status == STATUS_P1_WINS:
            text = "You win!" if self.vs_ai else "White wins!"
            text += "   R: play again   M: menu"
        elif status == STATUS_P2_WINS:
            text = "AI wins." if self.vs_ai else "Black wins!"
            text += "   R: play again   M: menu"
        else:
            text = "Draw.   R: play again   M: menu"

        surf = self.font.render(text, True, COLOR_STATUS_TEXT)
        self.screen.blit(surf, (12, BOARD_PIXELS + STATUS_HEIGHT // 2 - surf.get_height() // 2))

    def draw(self, thinking=False):
        self.draw_board()
        self.draw_destinations()
        self.draw_pieces()
        self.draw_status_bar(thinking=thinking)

    # ------------------------------------------------------------
    # Main loop
    # ------------------------------------------------------------

    def run(self):
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        running = False

                    elif self.mode == "MENU":
                        if event.key == pygame.K_1:
                            self.start_game(vs_ai=True, depth=DIFFICULTY_DEPTH["EASY"])
                        elif event.key == pygame.K_2:
                            self.start_game(vs_ai=True, depth=DIFFICULTY_DEPTH["MEDIUM"])
                        elif event.key == pygame.K_3:
                            self.start_game(vs_ai=True, depth=DIFFICULTY_DEPTH["HARD"])
                        elif event.key == pygame.K_h:
                            self.start_game(vs_ai=False)

                    elif self.mode == "PLAYING":
                        if event.key == pygame.K_r:
                            self.start_game(vs_ai=self.vs_ai, depth=self.ai_depth)
                        elif event.key == pygame.K_m:
                            self.mode = "MENU"

                elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                    if self.mode == "PLAYING":
                        self.handle_click(event.pos)

            if self.mode == "MENU":
                self.draw_menu()
            else:
                self.do_ai_move_if_pending()
                self.draw()
                pygame.display.flip()

            self.clock.tick(FPS)

        pygame.quit()
        sys.exit()


if __name__ == "__main__":
    DameGUI().run()