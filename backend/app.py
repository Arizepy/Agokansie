import threading
import time

import cv2
from flask import Flask
from flask_cors import CORS

from routes.game_routes import game_bp
from games.achi.vision import AchiVision
from services.camera_service import camera_service
# from services.robot_controller import RobotController

# robot_controller = RobotController("COM6", 115200)

app = Flask(__name__)

CORS(app)

# CORS(
#     app,
#     resources={r"/*": {"origins": "*"}},
#     allow_headers=["Content-Type", "Authorization"],
#     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
# )
# CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(game_bp, url_prefix="/api")

@app.route("/")
def home():
    return {
        "status": "running",
        "message": "Board Game Robot Server"
    }

def show_achi_camera_preview():

    vision = AchiVision()
    vision.debug_enabled = False

    while True:

        try:
            frame = camera_service.capture_frame()
            board = vision.scan_board(frame)
            annotated_frame = vision.annotate_frame(frame, board)

            cv2.imshow("Achi Vision", annotated_frame)

            key = cv2.waitKey(1) & 0xFF

            if key == 27 or key == ord("q"):
                break

        except Exception as e:
            print(f"Achi camera preview failed: {e}")
            time.sleep(1)

    cv2.destroyAllWindows()

def run_flask_app():

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        use_reloader=False
        # threaded=True
    )

if __name__ == "__main__":
    # flask_thread = threading.Thread(
    #     target=run_flask_app,
    #     daemon=True
    # )
    # flask_thread.start()

    run_flask_app()
    # show_achi_camera_preview()
