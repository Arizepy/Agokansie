from flask import Blueprint, request, jsonify

import traceback


from services.game_manager import game_manager
from services.camera_service import camera_service
# from services.robot_controller import robot_controller
from session.game_session import game_session

try:
    from services.robot_controller import RobotController
    robot_controller = RobotController("COM6", 115200)
except Exception as e:
    print(f"Robot initialization failed: {e}")
    robot_controller = None
game_bp = Blueprint("game", __name__)


def play_opening_robot_move(current_game):

    if robot_controller is None:
        raise RuntimeError("Robot controller is not connected")

    action = current_game.get_robot_move(
        current_game.engine.board
    )

    if action is None:
        raise RuntimeError("Robot could not generate an opening move")

    robot_controller.execute_action(
        current_game,
        action
    )

    current_game.apply_move(
        action["data"],
        current_game.ai_player
    )

    return action


def is_achi_game(current_game):

    return getattr(current_game, "name", None) == "achi"


@game_bp.route("/game/start", methods=["POST"])
def start_game():

    data = request.get_json()

    game_name = data.get("game")
    normalized_game_name = game_name.lower()

    game_manager.select_game(game_name)

    current_game = game_manager.get_current_game()
    current_game.reset()

    opening_robot_move = None

    if normalized_game_name == "achi":
        board_state = current_game.engine.board.copy()
        game_session.status = "waiting_for_opening_scan"
    else:
        board_state = camera_service.scan_board(
            current_game
        )
        game_session.status = "waiting_for_move"

    game_session.current_game = game_name
    game_session.board_state = board_state

    return jsonify({
        "success": True,
        "game": game_name,
        "board": board_state,
        "status": game_session.status,
        "robot_move": opening_robot_move,
        "state": current_game.get_state()
    })

# @game_bp.route("/game/select", methods=["POST"])
# def select_game():

#     data = request.get_json()

#     if not data:
#         return jsonify({
#             "success": False,
#             "message": "No data provided"
#         }), 400

#     game_name = data.get("game")
#     print(game_name)
#     if not game_name:
#         return jsonify({
#             "success": False,
#             "message": "Game name is required"
#         }), 400

#     try:
#         game_manager.select_game(game_name)

#         game_session.current_game = game_name
#         game_session.board_state = None
#         game_session.last_move = None
#         game_session.status = "waiting_for_scan"
#         # scan_board()

#         return jsonify({
#             "success": True,
#             "game": game_name,
#             "status": game_session.status
#         })

#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "message": str(e)
#         }), 500

# import traceback

@game_bp.route("/game/select", methods=["POST"])
def select_game():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data provided"
        }), 400

    game_name = data.get("game")
    normalized_game_name = game_name.lower()
    print("SELECTING:", game_name)

    try:
        game = game_manager.select_game(game_name)
        current_game = game_manager.get_current_game()
        current_game.reset()
        game_session.current_game = game_name
        game_session.last_move = None

        if normalized_game_name == "achi":
            game_session.board_state = current_game.engine.board.copy()
            game_session.status = "waiting_for_opening_scan"
        else:
            game_session.board_state = None
            game_session.status = "waiting_for_scan"

        return jsonify({  
            "success": True,
            "game": game_name,
            "status": game_session.status,
            "robot_move": None,
            "state": current_game.get_state()
        })

    except Exception as e:
        print("🔥 ERROR OCCURRED:")
        print(traceback.format_exc())   # <-- THIS IS KEY

        return jsonify({
            "success": False,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500
        
@game_bp.route("/game/dispense", methods=["POST"])
def dispense_reward():
    try:
        robot_controller.game_over_dispenser()

        return jsonify({
            "success": True,
            "message": "Enjoy your reward",
        })

    except Exception as e:
        print("🔥 DISPENSE ERROR:")
        print(traceback.format_exc())

        return jsonify({
            "success": False,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500
@game_bp.route("/game/scan", methods=["POST"])
def scan_board():

    try:
        current_game = game_manager.get_current_game()
        #current_game=game_session.current_game()
        # current_game='oware'
        # print("CURRENT GAME:", current_game)
        # print("TYPE:", type(current_game))
        # print("HAS VISION:", hasattr(current_game, "vision"))
        if current_game is None:
            return jsonify({
                "success": False,
                "message": "No game selected"
            }), 400

        robot_move = None

        if (
            is_achi_game(current_game)
            and game_session.status == "waiting_for_opening_scan"
        ):
            game_session.status = "robot_playing"
            robot_move = play_opening_robot_move(
                current_game
            )
            board_state = current_game.engine.board.copy()
            game_session.status = "waiting_for_player"
        else:
            # board_state = camera_service.scan_board(current_game)
            board_state = current_game.engine.board
            game_session.status = "waiting_for_move"
        #print(board_state)

        game_session.board_state = board_state

        # return jsonify({
        #     "success": True,
        #     "board": board_state,
        #     "status": game_session.status
        # })
        state = current_game.get_state()
        print(state)
        state["status"] = game_session.status

        return jsonify({
            "success": True,
            "robot_move": robot_move,
            "state": state
        })

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# @game_bp.route("/game/play", methods=["POST"])
# def play_move():

#     try:

#         current_game = game_manager.get_current_game()

#         if current_game is None:
#             return jsonify({
#                 "success": False,
#                 "message": "No game selected"
#             }), 400

#         if game_session.board_state is None:
#             return jsonify({
#                 "success": False,
#                 "message": "Board has not been scanned"
#             }), 400

#         game_session.status = "robot_playing"

#         move = current_game.get_best_move(
#             game_session.board_state
#         )

#         robot_controller.execute_move(move)

#         updated_board = camera_service.scan_board(
#             current_game
#         )

#         game_session.board_state = updated_board
#         game_session.last_move = move
#         game_session.status = "waiting_for_move"

#         return jsonify({
#             "success": True,
#             "move": move,
#             "board": updated_board,
#             "status": game_session.status
#         })

#     except Exception as e:
#         game_session.status = "error"

#         return jsonify({
#             "success": False,
#             "message": str(e)
#         }), 500

# @game_bp.route("/game/play", methods=["POST"])
# def play_move():

#     try:

#         current_game = game_manager.get_current_game()

#         if current_game is None:
#             return jsonify({"success": False, "message": "No game selected"}), 400

#         if game_session.board_state is None:
#             return jsonify({"success": False, "message": "Board has not been scanned"}), 400

#         game_session.status = "robot_playing"

#         # 1. AI move
#         action = current_game.get_robot_move(game_session.board_state)

#         # 2. Robot executes action (NEW SYSTEM)
#         robot_controller.execute_action(current_game, action)

#         # 3. Rescan board
#         updated_board = camera_service.scan_board(current_game)

#         game_session.board_state = updated_board
#         game_session.last_move = action
#         game_session.status = "waiting_for_move"

#         return jsonify({
#             "success": True,
#             "move": action,
#             "board": updated_board,
#             "status": game_session.status
#         })

#     except Exception as e:
#         game_session.status = "error"

#         return jsonify({
#             "success": False,
#             "message": str(e)
#         }), 500

# @game_bp.route("/game/play", methods=["POST"])
# def play_move():

#     try:

#         current_game = game_manager.get_current_game()

#         print("GAME OBJECT:", current_game)
#         print("GAME TYPE:", type(current_game))

#         if current_game is None:
#             return jsonify({"success": False, "message": "No game selected"}), 400

#         print("BOARD STATE:", game_session.board_state)

#         if game_session.board_state is None:
#             return jsonify({"success": False, "message": "Board has not been scanned"}), 400

#         game_session.status = "robot_playing"

#         # =========================
#         # STEP 1: AI
#         # =========================
#         action = current_game.get_robot_move(game_session.board_state)

#         print("ACTION GENERATED:", action)

#         # =========================
#         # STEP 2: ROBOT
#         # =========================
#         robot_controller.execute_action(current_game, action)

#         # =========================
#         # STEP 3: RESCAN
#         # =========================
#         updated_board = camera_service.scan_board(current_game)

#         game_session.board_state = updated_board
#         game_session.last_move = action
#         game_session.status = "waiting_for_move"

#         return jsonify({
#             "success": True,
#             "move": action,
#             "board": updated_board,
#             "status": game_session.status
#         })

#     except Exception as e:

#         import traceback

#         print("🔥 FULL ERROR TRACEBACK:")
#         traceback.print_exc()

#         return jsonify({
#             "success": False,
#             "message": str(e) if str(e) else "Unknown error",
#             "traceback": traceback.format_exc()
#         }), 500
        
        
# @game_bp.route("/game/play", methods=["POST"])
# def play_move():

#     try:

#         current_game = game_manager.get_current_game()

#         if current_game is None:
#             return jsonify({
#                 "success": False,
#                 "message": "No game selected"
#             }), 400

#         game_session.status = "robot_playing"

#         # =========================
#         # STEP 1: SCAN BOARD
#         # =========================
#         users_play = camera_service.scan_board(
#             current_game
#         )
#         board_state = current_game.engine.board

#         game_session.board_state = board_state
#         print(users_play)
#         if users_play != board_state:
#             game_session.status="user did not play well"
#             print("user did not play not play")
#         if game_session.last_move== board_state:
#             game_session.status="make your move"
#             print("make your move")
               
#         #find user move 
#         users_pit=current_game.find_user_move(users_play)
#         current_game.engine.play_move(users_pit)

#         print("CURRENT BOARD:", board_state)

#         # =========================
#         # STEP 2: AI MOVE
#         # =========================
#         action = current_game.get_robot_move(
#             board_state
#         )

#         print("ACTION GENERATED:", action)
#         current_game.engine.play_move(action['data']['pit'])
#         if action is None:
#             raise ValueError(
#                 "AI could not generate a move"
#             )
#         game_session.status="robot is playing"
#         # =========================
#         # STEP 3: ROBOT EXECUTES
#         # =========================
#         robot_controller.execute_action(
#             current_game,
#             action
#         )

#         # =========================
#         # STEP 4: VERIFY BOARD
#         # =========================
#         # updated_board = camera_service.scan_board(
#         #     current_game
#         # )
#         updated_board = current_game.engine.board


#         game_session.board_state = updated_board
#         game_session.last_move = board_state
#         game_session.status = "waiting_for_move"

#         return jsonify({
#             "success": True,
#             "move": action,
#             "board": updated_board,
#             "status": game_session.status
#         })

#     except Exception as e:

#         import traceback

#         print("🔥 FULL ERROR TRACEBACK:")
#         traceback.print_exc()

#         game_session.status = "error"

#         return jsonify({
#             "success": False,
#             "message": str(e),
#             "traceback": traceback.format_exc()
#         }), 500
        

@game_bp.route("/game/play", methods=["POST"])
def play_move():

    try:

        current_game = game_manager.get_current_game()

        if current_game is None:
            return jsonify({
                "success": False,
                "message": "No game selected"
            }), 400

        # =========================
        # STEP 1: SAVE CURRENT STATE
        # =========================
        previous_board = current_game.engine.board.copy()

        # =========================
        # STEP 2: SCAN USER MOVE
        # =========================
        game_session.status = "scanning_board"
        # if current_game=="achi":
        # robot_controller.camera_cal_for_achi()
        scanned_board = camera_service.scan_board(
            current_game
        )
        

        print("Previous:", previous_board)
        print("Scanned :", scanned_board)
        

        # # User has not moved
        if scanned_board == previous_board:

            game_session.status = "waiting_for_player"
            print (":i am here")
            return jsonify({
                "success": False,
                "message": "Please make your move",
                "status": game_session.status
            }), 400

        # =========================
        # STEP 3: DETECT USER ACTION
        # =========================
        user_move = current_game.detect_human_move(
            scanned_board
        )
        
        if not current_game.validate_move(user_move, current_game.human_player):
                return jsonify({
                    "success": False,
                    "message": "Illegal move"
                }), 400

        
        if user_move is None:

            game_session.status = "invalid_move"

            return jsonify({
                "success": False,
                "message": "Invalid move detected",
                "board": [0,0,0,0,0,0,0,0,0,0,0,0]
            }), 400

        print("USER MOVE:", user_move)

        # =========================
        # STEP 4: APPLY USER MOVE
        # =========================
        # current_game.apply_move(user_move,2)
        
        current_game.apply_move(user_move, current_game.human_player)
    
        board_after_player = current_game.engine.board.copy()

        game_session.board_state = board_after_player

        print("Board after player:")
        print(board_after_player)

        # =========================
        # STEP 5: GENERATE AI MOVE
        # =========================
        game_session.status = "robot_thinking"

        action = current_game.get_robot_move(
            board_after_player
        )

        if action is None:
            raise ValueError(
                "AI could not generate a move"
            )

        print("ROBOT ACTION:", action)

        # =========================
        # STEP 6: EXECUTE ROBOT MOVE
        # =========================
        game_session.status = "robot_playing"

        robot_controller.execute_action(
            current_game,
            action
        )

        current_game.apply_move(
            action["data"],1
        )
        # print("this is action data",action["data"])
        # # =========================
        # STEP 7: UPDATE SESSION
        # =========================
        updated_board = current_game.engine.board.copy()

        game_session.board_state = updated_board
        game_session.last_move = updated_board.copy()
        game_session.status = "waiting_for_player"
        
        state = current_game.get_state()
        state["status"] = game_session.status
        # print(state)

        return jsonify({
            "success": True,
            "user_move": user_move,
            "robot_move": action,
            "state": state
        })

        # return jsonify({
        #     "success": True,
        #     "user_move": user_move,
        #     "robot_move": action,
        #     "board": updated_board,
        #     "status": game_session.status
        # })

    except Exception as e:

        import traceback

        traceback.print_exc()
        # print("i am here")
        game_session.status = "error"

        return jsonify({
            "success": False,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500
@game_bp.route("/game/oware-play-human-move", methods=["POST"])
def play_human_move():

    try:

        data = request.get_json(silent=True)

        if data is None:
            return jsonify({
                "success": False,
                "message": "No JSON body received"
            }), 400

        pit = data.get("pit")

        if pit is None:
            return jsonify({
                "success": False,
                "message": "Pit is required"
            }), 400

        current_game = game_manager.get_current_game()

        if current_game is None:
            return jsonify({
                "success": False,
                "message": "No active game"
            }), 400

        print("\n========== HUMAN MOVE ==========")
        print("Pit:", pit)
        print("Board Before:", current_game.engine.board)
        current_game.human_select=pit
        
        # Use method from OwareGame
        # move_result = current_game.play_human_move(int(pit))

        print("Board After:", current_game.engine.board)

        if current_game.is_game_over():
            return jsonify({
                "success": True,
                "game_over": True,
                # "move_result": move_result,
                "state": current_game.get_state()
            })

        robot_action = current_game.get_robot_move(
            current_game.engine.board
        )

        return jsonify({
            "success": True,
            "game_over": False,
            "human_move": pit,
            # "move_result": move_result,
            "robot_action": robot_action,
            "state": current_game.get_state()
        })

    except Exception as e:

        print("\n========== ERROR ==========")
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error_type": type(e).__name__,
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500
@game_bp.route("/game/state", methods=["GET"])
def get_state():

    return jsonify({
        "success": True,
        "game": game_session.current_game,
        "board": game_session.board_state,
        # "board": [4,4,4,4,5,4,4,4,4,4,4,4,12,11],
        
        "last_move": game_session.last_move,
        "status": game_session.status
    })


@game_bp.route("/game/reset", methods=["POST"])
def reset_game():

    game_session.board_state = None
    game_session.last_move = None
    game_session.status = "waiting_for_scan"

    return jsonify({
        "success": True,
        "status": game_session.status
    })
