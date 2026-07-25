from copy import deepcopy


RED = 1
WHITE = 2

RED_KING = 11
WHITE_KING = 22


# =====================================================
# PIECE
# =====================================================

class Piece:

    def __init__(self, row, col, value):

        self.row = row
        self.col = col
        self.value = value


    @property
    def color(self):

        if self.value in [RED, RED_KING]:
            return RED

        if self.value in [WHITE, WHITE_KING]:
            return WHITE

        return None


    @property
    def is_king(self):

        return self.value in [RED_KING, WHITE_KING]


# =====================================================
# GAME ENGINE
# =====================================================

class Dame:


    def __init__(self):

        self.board = self.create_board()



    # -------------------------------------------------
    # INITIAL BOARD
    # -------------------------------------------------

    def create_board(self):

        return [

            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],

            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],

            [0,2,0,2,0,2,0,2],
            [2,0,2,0,2,0,2,0],
            [0,2,0,2,0,2,0,2]

        ]



    # -------------------------------------------------
    # COPY BOARD
    # -------------------------------------------------

    def copy(self):

        new_game = Dame()

        new_game.board = deepcopy(self.board)

        return new_game



    # -------------------------------------------------
    # LOAD VISION BOARD
    # -------------------------------------------------

    def load_board(self, board):

        self.board = deepcopy(board)



    # -------------------------------------------------
    # GET PIECE
    # -------------------------------------------------

    def get_piece(self,row,col):

        value = self.board[row][col]

        if value == 0:
            return None


        return Piece(
            row,
            col,
            value
        )



    # -------------------------------------------------
    # GET ALL PIECES
    # -------------------------------------------------

    def get_all_pieces(self,color):

        pieces = []


        for r in range(8):

            for c in range(8):

                piece = self.get_piece(r,c)


                if piece and piece.color == color:

                    pieces.append(piece)


        return pieces



    # -------------------------------------------------
    # SET PIECE
    # -------------------------------------------------

    def set_piece(self,row,col,value):

        self.board[row][col] = value



    # -------------------------------------------------
    # REMOVE PIECE
    # -------------------------------------------------

    def remove_piece(self,row,col):

        self.board[row][col] = 0



    # -------------------------------------------------
    # MOVE PIECE
    # -------------------------------------------------

    def move_piece(self,piece,row,col):

        self.board[piece.row][piece.col] = 0

        self.board[row][col] = piece.value



    # -------------------------------------------------
    # PROMOTION
    # -------------------------------------------------

    def promote(self):

        for c in range(8):

            if self.board[0][c] == WHITE:

                self.board[0][c] = WHITE_KING



            if self.board[7][c] == RED:

                self.board[7][c] = RED_KING



    # -------------------------------------------------
    # WIN CHECK
    # -------------------------------------------------

    def winner(self):

        red = len(
            self.get_all_pieces(RED)
        )

        white = len(
            self.get_all_pieces(WHITE)
        )


        if red == 0:
            return WHITE


        if white == 0:
            return RED


        return None

    # =====================================================
    # VALID MOVES
    # =====================================================


    def get_valid_moves(game, piece):

        moves = {}

        directions = []


        # RED moves downward
        if piece.color == RED or piece.is_king:

            directions += [
                (1,-1),
                (1,1)
            ]


        # WHITE moves upward
        if piece.color == WHITE or piece.is_king:

            directions += [
                (-1,-1),
                (-1,1)
            ]



        for dr,dc in directions:


            row = piece.row + dr
            col = piece.col + dc


            # Normal move

            if 0 <= row < 8 and 0 <= col < 8:


                if game.board[row][col] == 0:

                    moves[(row,col)] = []



                else:

                    enemy = game.get_piece(
                        row,
                        col
                    )


                    if enemy and enemy.color != piece.color:


                        jump_row = row + dr
                        jump_col = col + dc


                        if (
                            0 <= jump_row < 8
                            and
                            0 <= jump_col < 8
                        ):


                            if game.board[jump_row][jump_col] == 0:

                                moves[
                                    (jump_row,jump_col)
                                ] = [enemy]



        return moves




    # -------------------------------------------------
    # BOARD EVALUATION
    # -------------------------------------------------

    def evaluate(self):

        score = 0


        for row in self.board:

            for piece in row:


                if piece == WHITE:

                    score += 1


                elif piece == RED:

                    score -= 1


                elif piece == WHITE_KING:

                    score += 3


                elif piece == RED_KING:

                    score -= 3



        return score
    
    
    
    
    
    def get_winner(self):

        red_pieces = 0
        white_pieces = 0


        # Count pieces
        for row in range(8):

            for col in range(8):

                value = self.board[row][col]


                if value == RED or value == RED_KING:

                    red_pieces += 1


                elif value == WHITE or value == WHITE_KING:

                    white_pieces += 1



        # No pieces left

        if red_pieces == 0:

            return WHITE


        if white_pieces == 0:

            return RED




        # Check available moves

        red_moves = False
        white_moves = False



        for row in range(8):

            for col in range(8):


                piece = self.get_piece(row,col)


                if piece:


                    moves = self.get_valid_moves(piece)



                    if moves:


                        if piece.color == RED:

                            red_moves = True


                        elif piece.color == WHITE:

                            white_moves = True





        # No legal moves

        if not red_moves:

            return WHITE



        if not white_moves:

            return RED




        # Game continues

        return None
# =====================================================
# MOVE GENERATION
# =====================================================


def get_all_moves(game, color):

    moves = []

    pieces = game.get_all_pieces(color)


    # Check if any capture exists
    capture_exists = False

    capture_moves = []


    for piece in pieces:

        captures = game.get_valid_moves(piece)

        for move, skip in captures.items():

            if skip:

                capture_exists = True

                capture_moves.append(
                    simulate_move(
                        game,
                        piece,
                        move,
                        skip
                    )
                )


    # Forced capture rule
    if capture_exists:

        return capture_moves



    # Normal moves

    for piece in pieces:

        moves_available = game.get_valid_moves(piece)


        for move, skip in moves_available.items():

            moves.append(
                simulate_move(
                    game,
                    piece,
                    move,
                    skip
                )
            )


    return moves




# =====================================================
# SIMULATE MOVE
# =====================================================


def simulate_move(game, piece, move, skip):

    new_game = game.copy()


    new_piece = new_game.get_piece(
        piece.row,
        piece.col
    )


    new_game.move_piece(
        new_piece,
        move[0],
        move[1]
    )


    if skip:


        for captured in skip:

            new_game.remove_piece(
                captured.row,
                captured.col
            )



    new_game.promote()


    return new_game




# =====================================================
# MINIMAX WITH ALPHA BETA
# =====================================================


def minimax(
        position,
        depth,
        max_player,
        alpha=float("-inf"),
        beta=float("inf")
):


    winner = position.winner()


    if depth == 0 or winner is not None:

        return (
            position.evaluate(),
            position
        )



    if max_player:


        max_eval = float("-inf")

        best_move = None



        for move in get_all_moves(
            position,
            WHITE
        ):


            evaluation = minimax(
                move,
                depth-1,
                False,
                alpha,
                beta
            )[0]



            if evaluation > max_eval:

                max_eval = evaluation

                best_move = move



            alpha = max(
                alpha,
                evaluation
            )


            if beta <= alpha:

                break



        return (
            max_eval,
            best_move
        )



    else:


        min_eval = float("inf")

        best_move = None



        for move in get_all_moves(
            position,
            RED
        ):


            evaluation = minimax(
                move,
                depth-1,
                True,
                alpha,
                beta
            )[0]



            if evaluation < min_eval:

                min_eval = evaluation

                best_move = move



            beta = min(
                beta,
                evaluation
            )


            if beta <= alpha:

                break



        return (
            min_eval,
            best_move
        )