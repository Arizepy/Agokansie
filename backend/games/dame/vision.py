import cv2
import json
import numpy as np
from pathlib import Path


EMPTY = 0

RED = 1
WHITE = 2

RED_KING = 11
WHITE_KING = 22


class DameVision:

    def __init__(self):

        self.debug_enabled = False

        # Radius around each board square
        self.cell_radius = 20

        # Load calibration
        self.calibration = self.load_calibration()

        # =====================================================
        # COLOR RANGES (Same as Achi)
        # =====================================================
        # Peach Fuzz (Human = WHITE)
        # self.peach_lower = np.array([0, 0, 168])
        # self.peach_upper = np.array([179, 36, 255])
        
        # self.violet_lower = np.array([0, 90, 141])
        # self.violet_upper = np.array([179, 255, 255])

        # Interstellar Violet (Robot = RED)
        self.violet_lower = np.array([0, 0, 168])
        self.violet_upper = np.array([179, 36, 255])

        # Peach Fuzz (Human = WHITE)
        self.peach_lower = np.array([0, 90, 141])
        self.peach_upper = np.array([179, 255, 255])

    # =====================================================
    # CALIBRATION
    # =====================================================

    def load_calibration(self):

        path = Path("games/dame/calibration.json")

        if not path.exists():

            cells = {}

            start_x = 330
            start_y = 30
            spacing = 90

            index = 0

            for row in range(8):
                for col in range(8):

                    cells[str(index)] = [
                        start_x + col * spacing,
                        start_y + row * spacing
                    ]

                    index += 1
            
            # print(cells)
            
            
            return {
                "cells": cells
            }

        with open(path, "r") as f:
            return json.load(f)

    # =====================================================
    # MAIN SCAN
    # =====================================================

    # def scan_board(self, frame):

    #     board = []

    #     index = 0

    #     for row in range(8):

    #         current_row = []

    #         for col in range(8):

    #             x, y = self.calibration["cells"][str(index)]

    #             state = self.detect_cell(
    #                 frame,
    #                 x,
    #                 y
    #             )

    #             current_row.append(state)

    #             index += 1

    #         board.append(current_row)

    #     if self.debug_enabled:
    #         self.save_debug(frame, board)

    #     return board
    
    
    # def scan_board(self, frame):

    #     board = []

    #     index = 0

    #     for row in range(8):

    #         current_row = []

    #         for col in range(8):

    #             x, y = self.calibration["cells"][str(index)]

    #             # Only scan playable (dark) squares
    #             if (row + col) % 2 == 0:

    #                 state = self.detect_cell(
    #                     frame,
    #                     x,
    #                     y
    #                 )

    #             else:
    #                 state = EMPTY

    #             current_row.append(state)

    #             index += 1

    #         board.append(current_row)

    #     if self.debug_enabled:
    #         self.save_debug(frame, board)

    #     return board
    def scan_board(self, frame):

        board = []

        index = 0

        for row in range(8):

            for col in range(8):

                x, y = self.calibration["cells"][str(index)]

                # Only playable squares
                if (row + col) % 2 == 0:

                    state = self.detect_cell(
                        frame,
                        x,
                        y
                    )

                    # Convert vision values to engine values
                    if state == RED:
                        board.append(1)

                    elif state == WHITE:
                        board.append(3)

                    else:
                        board.append(0)

                index += 1

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
            return EMPTY

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
        # Circular mask
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
        # Peach Detection
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
        # Violet Detection
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

        # WHITE = HUMAN
        if peach_ratio > 0.12:
            return WHITE

        # RED = ROBOT
        if violet_ratio > 0.12:
            return RED

        return EMPTY

    # =====================================================
    # DEBUG IMAGE
    # =====================================================

    def save_debug(self, frame, board):

        image = self.annotate_frame(frame, board)

        cv2.imwrite(
            "games/dame/debug_board.png",
            image
        )

    # def annotate_frame(self, frame, board):

    #     image = frame.copy()

    #     index = 0

    #     for row in range(8):

    #         for col in range(8):

    #             x, y = self.calibration["cells"][str(index)]

    #             cv2.circle(
    #                 image,
    #                 (x, y),
    #                 self.cell_radius,
    #                 (0, 255, 0),
    #                 2
    #             )

    #             value = board[row][col]

    #             color = (255, 255, 255)

    #             if value == RED:
    #                 color = (255, 0, 255)

    #             elif value == WHITE:
    #                 color = (0, 180, 255)

    #             cv2.putText(
    #                 image,
    #                 str(value),
    #                 (x - 12, y - 12),
    #                 cv2.FONT_HERSHEY_SIMPLEX,
    #                 0.7,
    #                 color,
    #                 2
    #             )

    #             index += 1

    #     return image
    
    
    
    def annotate_frame(self, frame, board):

        image = frame.copy()

        index = 0
        playable = 0

        for row in range(8):

            for col in range(8):

                x, y = self.calibration["cells"][str(index)]

                cv2.circle(
                    image,
                    (x, y),
                    self.cell_radius,
                    (0, 255, 0),
                    2
                )

                if (row + col) % 2 == 0:

                    value = board[playable]

                    if value == 1:
                        color = (255, 0, 255)

                    elif value == 3:
                        color = (0, 180, 255)

                    else:
                        color = (255, 255, 255)

                    cv2.putText(
                        image,
                        str(value),
                        (x - 12, y - 12),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        color,
                        2
                    )

                    playable += 1

                index += 1

        return image

    # =====================================================
    # LIVE CAMERA TEST
    # =====================================================

    def test_camera(self):

        self.cap = cv2.VideoCapture(0)

        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        while True:

            ret, frame = self.cap.read()

            if not ret:
                break

            board = self.scan_board(frame)

            annotated = self.annotate_frame(
                frame,
                board
            )

            cv2.imshow(
                "Dame Vision",
                annotated
            )

            print(board)

            key = cv2.waitKey(1)

            if key == 27:
                break

        self.cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":

    vision = DameVision()
    vision.test_camera()