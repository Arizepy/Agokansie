
import cv2


class CameraService:

    def __init__(self, camera_index=0):

        self.camera_index = camera_index

        self.cap = cv2.VideoCapture(camera_index)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH,1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        if not self.cap.isOpened():
            raise Exception(
                f"Could not open camera at index {camera_index}"
            )

    # =====================================
    # CAPTURE FRAME
    # =====================================
    def capture_frame(self):

        ret, frame = self.cap.read()

        if not ret:
            raise Exception("Failed to capture frame from camera")

        return frame

    # =====================================
    # SCAN BOARD
    # =====================================
    def scan_board(self, game):

        """
        Capture a frame and let the selected
        game's vision system interpret it.
        """

        frame = self.capture_frame()

        # Save latest image for debugging
        cv2.imwrite("latest_scan.jpg", frame)

        if not hasattr(game, "vision"):
            raise Exception(
                f"{type(game).__name__} does not have a vision module"
            )

        # board_state = game.vision.detect_board(frame)

        # return board_state
        board_state = game.vision.detect_board(frame)

        # print("BOARD STATE:", board_state)

        return board_state

    # =====================================
    # SAVE IMAGE
    # =====================================
    def save_debug(self, frame, path="debug.jpg"):

        cv2.imwrite(path, frame)

    # =====================================
    # SHOW LIVE FRAME
    # =====================================
    def show_frame(self, window_name="Camera"):

        frame = self.capture_frame()

        cv2.imshow(window_name, frame)

        cv2.waitKey(1)

    # =====================================
    # SHOW LIVE STREAM
    # =====================================
    def preview(self):

        while True:

            frame = self.capture_frame()

            cv2.imshow("Camera Preview", frame)

            key = cv2.waitKey(1) & 0xFF

            if key == ord("q"):
                break

        cv2.destroyAllWindows()

    # =====================================
    # RELEASE CAMERA
    # =====================================
    def release(self):

        if self.cap is not None:
            self.cap.release()

        cv2.destroyAllWindows()


# =====================================
# GLOBAL CAMERA INSTANCE
# =====================================

camera_service = CameraService()