# import cv2
# import json
# import numpy as np
# from pathlib import Path


# class AchiVision:

#     def __init__(self):

#         self.debug_enabled = True

#         self.cell_radius = 35

#         self.calibration = self.load_calibration()

#         self.red_lower1 = np.array([0, 100, 80])
#         self.red_upper1 = np.array([10, 255, 255])

#         self.red_lower2 = np.array([170, 100, 80])
#         self.red_upper2 = np.array([180, 255, 255])

#     # =====================================================
#     # CALIBRATION
#     # =====================================================

#     def load_calibration(self):

#         path = Path("games/achi/calibration.json")

#         if not path.exists():

#             return {
#                 "cells": {
#                     "0": [100, 100],
#                     "1": [200, 100],
#                     "2": [300, 100],

#                     "3": [100, 200],
#                     "4": [200, 200],
#                     "5": [300, 200],

#                     "6": [100, 300],
#                     "7": [200, 300],
#                     "8": [300, 300]
#                 }
#             }

#         with open(path, "r") as f:
#             return json.load(f)

#     # =====================================================
#     # MAIN SCAN
#     # =====================================================

#     def scan_board(self, frame):

#         board = []

#         for i in range(9):

#             x, y = self.calibration["cells"][str(i)]

#             state = self.detect_cell(
#                 frame,
#                 x,
#                 y
#             )

#             board.append(state)

#         if self.debug_enabled:
#             self.save_debug(frame, board)

#         return board
#     def detect_board(self, frame):

#         return self.scan_board(frame)
#     # =====================================================
#     # CELL DETECTION
#     # =====================================================

#     def detect_cell(self, frame, x, y):

#         r = self.cell_radius

#         h, w = frame.shape[:2]

#         x1 = max(0, x - r)
#         y1 = max(0, y - r)

#         x2 = min(w, x + r)
#         y2 = min(h, y + r)

#         roi = frame[y1:y2, x1:x2]

#         if roi.size == 0:
#             return 0

#         return self.classify_piece(roi)

#     # =====================================================
#     # CLASSIFICATION
#     # =====================================================

#     def classify_piece(self, roi):

#         hsv = cv2.cvtColor(
#             roi,
#             cv2.COLOR_BGR2HSV
#         )

#         # -------------------------
#         # RED DETECTION
#         # -------------------------

#         red_mask1 = cv2.inRange(
#             hsv,
#             self.red_lower1,
#             self.red_upper1
#         )

#         red_mask2 = cv2.inRange(
#             hsv,
#             self.red_lower2,
#             self.red_upper2
#         )

#         red_mask = cv2.bitwise_or(
#             red_mask1,
#             red_mask2
#         )

#         red_pixels = cv2.countNonZero(
#             red_mask
#         )

#         # -------------------------
#         # BLACK DETECTION
#         # -------------------------

#         gray = cv2.cvtColor(
#             roi,
#             cv2.COLOR_BGR2GRAY
#         )

#         black_pixels = np.sum(
#             gray < 60
#         )

#         area = roi.shape[0] * roi.shape[1]

#         red_ratio = red_pixels / area
#         black_ratio = black_pixels / area

#         # RED = HUMAN = 2
#         if red_ratio > 0.20:
#             return 2

#         # BLACK = ROBOT = 1
#         if black_ratio > 0.40:
#             return 1

#         return 0

#     # =====================================================
#     # DEBUG IMAGE
#     # =====================================================

#     def save_debug(self, frame, board):

#         image = frame.copy()

#         for i in range(9):

#             x, y = self.calibration["cells"][str(i)]

#             cv2.circle(
#                 image,
#                 (x, y),
#                 self.cell_radius,
#                 (0, 255, 0),
#                 2
#             )

#             cv2.putText(
#                 image,
#                 str(board[i]),
#                 (x - 10, y - 15),
#                 cv2.FONT_HERSHEY_SIMPLEX,
#                 0.8,
#                 (255, 0, 0),
#                 2
#             )

#         cv2.imwrite(
#             "games/achi/debug_board.png",
#             image
#         )

#     # =====================================================
#     # LIVE TEST
#     # =====================================================

#     def test_camera(self):

#         cap = cv2.VideoCapture(0)

#         while True:

#             ret, frame = cap.read()

#             if not ret:
#                 break

#             board = self.scan_board(frame)

#             cv2.imshow(
#                 "Achi Vision",
#                 frame
#             )

#             print(board)

#             key = cv2.waitKey(1)

#             if key == 27:
#                 break

#         cap.release()
#         cv2.destroyAllWindows()
# g=AchiVision()
# g.test_camera()




import cv2
import json
import numpy as np
from pathlib import Path


class AchiVision:

    def __init__(self):

        self.debug_enabled = False

        # Radius around each board position
        self.cell_radius = 60

        # Load calibration
        self.calibration = self.load_calibration()

        # ==========================================
        # COLOR RANGES (HSV)
        # Adjust if necessary for your camera
        # ==========================================

        # Peach Fuzz (Human = 2)
        # Pink / Peach
        # self.peach_lower = np.array([67, 0, 113])
        # self.peach_upper = np.array([168, 29, 255])
        # # Interstellar Violet (Robot = 1)
        # self.violet_lower = np.array([0, 90, 141])
        # self.violet_upper = np.array([179, 255, 255])
        
        self.violet_lower = np.array([67, 0, 113])
        self.violet_upper = np.array([168, 29, 255])
        # Interstellar Violet (Robot = 1)
        self.peach_lower = np.array([0, 90, 141])
        self.peach_upper = np.array([179, 255, 255])


    # =====================================================
    # CALIBRATION
    # =====================================================

    def load_calibration(self):

        path = Path("/Users/user/Workspace/wro2026/games/achi/fahh.json")
        print (path)

        if not path.exists():

            return {
                # "cells": {
                #     "0": [170,120],
                #     "1": [310,120],
                #     "2": [450,120],

                #     "3": [170,260],
                #     "4": [310,260],
                #     "5": [450,260],

                #     "6": [170,395],
                #     "7": [310,395],
                #     "8": [450,395]
                #             }
                
                
                "cells": {
                    "0": [437,180],
                    "1": [640,180],
                    "2": [850,180],

                    "3": [437,390],
                    "4": [640,390],
                    "5": [850,390],

                    "6": [437,600],
                    "7": [640,600],
                    "8": [850,600]
                            }
            }

        with open(path, "r") as f:
            return json.load(f)

    # =====================================================
    # MAIN SCAN
    # =====================================================

    def scan_board(self, frame):

        board = []

        for i in range(9):

            x, y = self.calibration["cells"][str(i)]

            state = self.detect_cell(
                frame,
                x,
                y
            )

            board.append(state)

        if self.debug_enabled:
            self.save_debug(frame, board)

        return board

    def detect_board(self, frame):
        return self.scan_board(frame)

    # =====================================================
    # CELL DETECTION
    # =====================================================

    def detect_cell(self, frame, x, y):

        r = self.cell_radius

        h, w = frame.shape[:2]

        x1 = max(0, x - r)
        y1 = max(0, y - r)

        x2 = min(w, x + r)
        y2 = min(h, y + r)

        roi = frame[y1:y2, x1:x2]

        if roi.size == 0:
            return 0

        return self.classify_piece(roi)

    # =====================================================
    # PIECE CLASSIFICATION
    # =====================================================

    def classify_piece(self, roi):

        hsv = cv2.cvtColor(
            roi,
            cv2.COLOR_BGR2HSV
        )

        # --------------------------------------
        # Create circular mask
        # --------------------------------------

        mask = np.zeros(
            hsv.shape[:2],
            dtype=np.uint8
        )

        center = (
            mask.shape[1] // 2,
            mask.shape[0] // 2
        )

        radius = min(mask.shape) // 3

        cv2.circle(
            mask,
            center,
            radius,
            255,
            -1
        )

        # --------------------------------------
        # Peach detection
        # --------------------------------------

        peach = cv2.inRange(
            hsv,
            self.peach_lower,
            self.peach_upper
        )

        peach = cv2.bitwise_and(
            peach,
            mask
        )

        # --------------------------------------
        # Violet detection
        # --------------------------------------

        violet = cv2.inRange(
            hsv,
            self.violet_lower,
            self.violet_upper
        )

        violet = cv2.bitwise_and(
            violet,
            mask
        )

        # --------------------------------------
        # Remove small blobs
        # --------------------------------------

        kernel = np.ones(
            (3, 3),
            np.uint8
        )

        peach = cv2.morphologyEx(
            peach,
            cv2.MORPH_OPEN,
            kernel
        )

        violet = cv2.morphologyEx(
            violet,
            cv2.MORPH_OPEN,
            kernel
        )

        area = cv2.countNonZero(mask)

        peach_ratio = (
            cv2.countNonZero(peach) / area
        )

        violet_ratio = (
            cv2.countNonZero(violet) / area
        )

        # --------------------------------------
        # Classification
        # --------------------------------------

        if peach_ratio > 0.12:
            return 2

        if violet_ratio > 0.12:
            return 1

        return 0

    # =====================================================
    # DEBUG IMAGE
    # =====================================================

    def save_debug(self, frame, board):

        image = self.annotate_frame(frame, board)

        cv2.imwrite(
            "games/achi/debug_board.png",
            image
        )

    def annotate_frame(self, frame, board):

        image = frame.copy()

        for i in range(9):

            x, y = self.calibration["cells"][str(i)]

            # Draw detection circle
            cv2.circle(
                image,
                (x, y),
                self.cell_radius,
                (0, 255, 0),
                2
            )

            color = (255, 255, 255)

            if board[i] == 1:
                color = (255, 0, 255)      # Violet

            elif board[i] == 2:
                color = (0, 180, 255)      # Peach

            cv2.putText(
                image,
                str(board[i]),
                (x - 12, y - 15),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                color,
                2
            )

        return image

    # =====================================================
    # LIVE CAMERA TEST
    # =====================================================

    def test_camera(self):

        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH,1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        while True:

            ret, frame = self.cap.read()

            if not ret:
                break

            board = self.scan_board(frame)
            annotated_frame = self.annotate_frame(frame, board)

            cv2.imshow(
                "Achi Vision",
                annotated_frame
            )

            print(board)

            key = cv2.waitKey(1)

            if key == 27:
                break

        self.cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":

    vision = AchiVision()
    vision.test_camera()
