import copy,random
from games.base_game import BaseGame

from games.oware.engine import (
    Oware,
    minimax
)

from games.oware.vision import OwareVision


class OwareGame(BaseGame):

    def __init__(self):

        super().__init__("oware")

        self.engine = Oware()

        self.vision = OwareVision()

        self.search_depth = 2
        self.human_select=None

    # =====================================================
    # VISION
    # =====================================================

    def scan_board(self):

        """
        Uses camera vision.

        Returns:
            [4,4,4,4,4,4,4,4,4,4,4,4]
        """

        board = self.vision.scan_board()
        # board=[4,4,4,4,4,4,4,4]

        self.engine.board = board

        self.board_state = board

        return board
    

#     def find_user_move(self, scanned_board):

#         current_board = self.engine.board
#         current_player = self.engine.current_player

#         # Determine which pits belong to the current player
#         # if current_player == 1:
#         #     pits = range(0, 6)
#         # else:
#         #     pits = range(6, 12)
#         pits = range(0, 6)
#         matches = []
        
#         tests=[]

#         for pit in pits:
#             # print(pits,"here are the pits ")
#             # Skip empty pits
#             if current_board[pit] == 0:
#                 continue

#             # Make a deep copy of the engine
#             test_engine = copy.deepcopy(self.engine)
#             test_engine.current_player=1

#             try:
#                 # Simulate the move
#                 test_engine.play_move(pit)
#                 # tests.append(test_engine.board)
#                 print(test_engine.board)
#                 for p in range(len(test_engine.board)):
#                 # Check if the result matches what the camera saw
#                 if test_engine.board == scanned_board:
#                     matches.append(pit)

#             except Exception as e:
#                 print(f"Simulation failed for pit {pit}: {e}")
#         # print(tests)
#         # No matching move
#         if len(matches) == 0:
#             return None

#         # Exactly one matching move
#         if len(matches) == 1:
#             return matches[0]

#         # Multiple matches (should be rare)
#         raise ValueError(f"Multiple possible moves found: {matches}")   
# # human move 



    # def find_user_move(self, scanned_board):

    #     current_board = self.engine.board

    #     pits = range(0, 6)

    #     best_pit = None
    #     best_score = -1

    #     for pit in pits:

    #         if current_board[pit] == 0:
    #             continue

    #         test_engine = copy.deepcopy(self.engine)
    #         test_engine.current_player = 1

    #         try:
    #             test_engine.play_move(pit)

    #             score = 0
    #             comparisons = 0

    #             # Compare only pits that changed AND are visible (<5)
    #             for i in range(12):

    #                 if current_board[i] != test_engine.board[i]:

    #                     if test_engine.board[i] < 5:

    #                         comparisons += 1

    #                         if scanned_board[i] == test_engine.board[i]:
    #                             score += 1

    #             print(f"\nPit {pit}")
    #             print("Simulated :", test_engine.board)
    #             print("Scanned   :", scanned_board)
    #             print(f"Score: {score}/{comparisons}")

    #             if score > best_score:
    #                 best_score = score
    #                 best_pit = pit

    #         except Exception as e:
    #             print(f"Simulation failed for pit {pit}: {e}")
    #     return best_pit
    
    
    def find_user_move(self, scanned_board):

        current_board = self.engine.board
        pits = range(0, 6)      # Human pits

        best_pit = None
        least_errors = float("inf")

        for pit in pits:

            # Skip empty pits
            if current_board[pit] == 0:
                continue

            # Simulate the move
            test_engine = copy.deepcopy(self.engine)
            test_engine.current_player = 1

            try:
                result = test_engine.play_move(pit)

                # Invalid move
                if result is None:
                    continue

                errors = 0
                comparisons = 0

                # Compare only pits that changed
                for i in range(12):

                    if current_board[i] != test_engine.board[i]:

                        # Ignore pits that the vision cannot distinguish
                        if test_engine.board[i] >= 3:
                            continue

                        comparisons += 1

                        if scanned_board[i] != test_engine.board[i]:
                            errors += 1

                print(f"\nTesting pit {pit}")
                print("Simulated :", test_engine.board)
                print("Scanned   :", scanned_board)
                print(f"Comparisons: {comparisons}")
                print(f"Errors     : {errors}")

                # Keep the move with the fewest errors
                if errors < least_errors:
                    least_errors = errors
                    best_pit = pit

            except Exception as e:
                print(f"Simulation failed for pit {pit}: {e}")

        # Reject if no simulation was successful
        if best_pit is None:
            return None

        # Reject if the best match is still too different
        # Adjust this threshold depending on your vision accuracy.
        if least_errors > 1:
            return None

        return best_pit
    def play_human_move(self, pit):

        if not self.engine.is_valid_move(pit):
            raise ValueError(f"Invalid move: pit {pit}")

        result = self.engine.play_move(pit)

        self.board_state = self.engine.board

        return result
    
    # OwareGame
    def detect_human_move(self, scanned_board):
        pit = self.find_user_move(scanned_board)

        if pit is None:
            return self.human_select
        

        return {
            "type": "pit",
            "pit": pit
        }
    # =====================================================
    # AI
    # =====================================================

    def get_best_move(self, board_state):

        self.engine.board = board_state

        score, move = minimax(
            self.engine,
            self.search_depth,
            float("-inf"),
            float("inf"),
            True
        )

        if move is None:
            raise ValueError("Minimax returned None (no valid moves)")

        return {"pit": move}

    # =====================================================
    # RULES
    # =====================================================

    def validate_move(self, move):

        pit = move["pit"]

        return self.engine.is_valid_move(pit)

    def apply_move(self, move,player):

        pit = move["pit"]

        result = self.engine.play_move(pit)

        self.board_state = self.engine.board

        return result

    # =====================================================
    # GAME OVER
    # =====================================================

    def is_game_over(self):

        return self.engine.game_over()

    def finalize_game(self):

        self.engine.finalize_game()

    # =====================================================
    # SCORES
    # =====================================================
    # def get_sow_path(self, pit):

    #     board = self.engine.board   # ✅ FIX HERE

    #     path = []
    #     seeds = board[pit]
    #     print("the seeds are ")
    #     print(seeds)
    #     index = pit

    #     while seeds > 0:
    #         index = (index + 1) % 12

    #         path.append(index)
    #         seeds -= 1

    #     return path
    
    
    def get_sow_path(self, pit):

        result = self.engine.make_move(pit)   # ✅ FIX HERE
        path=result["sow_path"]
        
        print("the seeds are ")
        return path
    def get_captures(self, pit):

        result = self.engine.make_move(pit)   # ✅ FIX HERE
        captures=result["captures"]
        
        print("the seeds are ")
        return captures
    def get_moves(self, pit):

        result = self.engine.make_move(pit)   # ✅ FIX HERE
        moves=result["moves"]
        
        print("the seeds are ")
        return moves
    def get_scores(self):

        return {
            "player": self.engine.scores[0],
            "robot": self.engine.scores[1]
        }

    # =====================================================
    # STATE
    # =====================================================

    def get_state(self):

        return {
            "game": self.name,

            "board": self.engine.board,

            "scores": {
                "player": self.engine.scores[0],
                "robot": self.engine.scores[1]
            },
            "ratings":random.randint(0,1),

            "current_player":
                self.engine.current_player,

            "game_over":
                self.engine.game_over()
        }

    # =====================================================
    # ROBOT COORDINATES
    # =====================================================

    def map_to_coordinates(self, pit):

        pit_map = {

            6: (12, 68),
            7: (65, 68),
            8: (118, 68),
            9: (170, 68), 
            10: (223, 68),
            11: (273, 68),

            0: (273, 135),
            1: (223, 135),
            2: (170, 135),
            3: (118, 135),
            4: (65, 135),
            5: (12, 135)
        }

        return pit_map[pit]

    # =====================================================
    # SPECIAL ROBOT MOVE FOR OWARE
    # =====================================================

    def get_robot_move(self, board_state):

        ai_move = self.get_best_move(board_state)

        # return {
        #     "type": "oware_action",
        #     "action": "sow",
        #     "data": {
        #         "pit": ai_move["pit"],
        #         "sow_path": self.get_sow_path(ai_move["pit"]),
        #         "captures":self.get_captures(ai_move["pit"])
        #     }
        # }
        return {
            "type": "oware_action",
            "action": "sow",
            "data": {
                "pit": ai_move["pit"],
                "moves": self.get_moves(ai_move["pit"]),
                
            }
        }

    # =====================================================
    # RESET
    # =====================================================

    def reset(self):

        self.engine = Oware()

        self.board_state = self.engine.board 