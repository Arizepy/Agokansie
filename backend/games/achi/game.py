








from games.base_game import BaseGame

from games.achi.engine import TapatanEngine

from games.achi.vision import AchiVision

import random



class AchiGame(BaseGame):


    def __init__(self):

        super().__init__("achi")

        self.engine = TapatanEngine()

        self.vision = AchiVision()

        # Engine owns the board
        self.engine.board = [0] * 9

        self.board_state = self.engine.board

        self.ai_player = 1
        self.human_player = 2
        self.current_player = self.ai_player

        self.search_depth = 8
        self.poses=[0,1,2]


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

        if self.current_player != self.human_player:
            return None

        return self.find_move_from_board(
            scanned_board
        )



    def find_move_from_board(self, scanned_board):

        """
        Compare the stored board with a newly scanned
        board and determine the human move.
        """

        if self.board_state is None:

            # self.engine.board = scanned_board.copy()

            # self.board_state = self.engine.board

            return None



        old_board = self.board_state

        start = None
        end = None



        for i in range(9):

            before = old_board[i]

            after = scanned_board[i]



            # Piece removed

            if before == self.human_player and after == 0:

                start = i



            # Piece placed

            elif before == 0 and after == self.human_player:

                end = i



        # -------------------
        # Placement phase
        # -------------------

        if start is None and end is not None:

            move = {

                "type": "place",

                "position": end

            }



        # -------------------
        # Movement phase
        # -------------------

        elif start is not None and end is not None:

            move = {

                "type": "move",

                "from": start,

                "to": end

            }



        else:

            return None



        # self.engine.board = scanned_board.copy()

        # self.board_state = self.engine.board

        return move



    # =====================================================
    # AI
    # =====================================================

    def get_best_move(self, board_state):

        if self.current_player != self.ai_player:
            return None

        self.engine.board = board_state

        self.board_state = board_state



        move = self.engine.best_move(

            self.engine.board,

            self.ai_player,

            self.search_depth

        )



        if move is None:

            return None



        if move[0] == "place":

            return {

                "type": "place",

                "position": move[1]

            }



        return {

            "type": "move",

            "from": move[1],

            "to": move[2]

        }



    # =====================================================
    # RULES
    # =====================================================

    def validate_move(self, move, player=None):

        if player is None:

            player = self.ai_player



        if move is None:

            return False



        if move["type"] == "place":

            engine_move = (

                "place",

                move["position"]

            )



        else:

            engine_move = (

                "move",

                move["from"],

                move["to"]

            )



        return self.engine.is_valid_move(

            self.engine.board,

            engine_move,

            player

        )



    # =====================================================
    # APPLY MOVE
    # =====================================================

    def apply_move(self, move, player=None):

        if player is None:

            player = self.ai_player

        print(move)

        if move["type"] == "place":

            engine_move = (

                "place",

                move["position"]

            )



        else:

            engine_move = (

                "move",

                move["from"],

                move["to"]

            )



        self.engine.board = self.engine.apply_move(

            self.engine.board,

            engine_move,

            player

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

        return self.engine.winner(
            self.engine.board
        ) != 0



    def get_winner(self):

        winner = self.engine.winner(
            self.engine.board
        )

        if winner == self.ai_player:

            return "robot"

        if winner == self.human_player:

            return "human"

        return None



    # =====================================================
    # PHASE
    # =====================================================

    def get_phase(self):

        return self.engine.get_phase(
            self.engine.board
        )



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
            return None

        # return move
        print(move)
        
        
        if move["type"]=="place":
            supply = self.poses.pop(0)
            data_to_return= {
                "type": "achi_action",
                "action": move["type"],
                "data": {
                    "type":move["type"],
                    "supply": supply,
                    "position": move["position"]
                    
                }
            
                }
            # del self.poses[0]
            
            
            
            return data_to_return
        
            
        return{
                "type": "achi_action",
            "action": move["type"],
            "data": {
                "type":move["type"],
                "from": move["from"],
                "to": move["to"]
                
            }
        
            }
            



    # =====================================================
    # BOARD COORDINATES
    # =====================================================

    def map_to_coordinates(self, position):

        mapping = {

            0: (82, 140),
            1: (143, 140),
            2: (203, 140),

            3: (82, 80),
            4: (143, 80),
            5: (203, 80),

            6: (82, 20),
            7: (143, 20),
            8: (203, 20)

        }

        return mapping[position]



    # =====================================================
    # ROBOT COMMAND
    # =====================================================

    def convert_to_robot_command(self, move):

        if move is None:

            return None


        if move["type"] == "place":

            return {

                "action": "place",

                "destination":
                    self.map_to_coordinates(
                        move["position"]
                    )

            }


        return {

            "action": "move",

            "source":
                self.map_to_coordinates(
                    move["from"]
                ),

            "destination":
                self.map_to_coordinates(
                    move["to"]
                )

        }



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

        self.engine = TapatanEngine()

        self.engine.board = [0] * 9
        self.poses=[0,1,2]
        self.current_player = self.ai_player


        self.board_state = self.engine.board
