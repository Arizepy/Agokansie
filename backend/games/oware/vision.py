




# # import cv2
# # import json
# # import numpy as np
# # from pathlib import Path


# # class OwareVision:

# #     def __init__(self):

# #         self.debug_enabled = False

# #         # Radius around each pit
# #         self.pit_radius = 90

# #         # Load calibration
# #         self.calibration = self.load_calibration()

# #         # =====================================================
# #         # HSV RANGE FOR THE SEEDS
# #         # =====================================================
# #         # Change these during calibration

# #         self.seed_lower = np.array([0, 0, 0])
# #         self.seed_upper = np.array([84, 255, 255])

# #         # Ignore tiny contours
# #         self.min_seed_area = 30

# #         # Ignore very large contours
# #         self.max_seed_area = 2000

# #     # =====================================================
# #     # CALIBRATION
# #     # =====================================================

# #     def load_calibration(self):

# #         path = Path("games/oware/calibration.json")

# #         if not path.exists():

# #             return {
# #                 "pits": {

# #                     "5": [160,230],
# #                     "4": [350,230],
# #                     "3": [540,230],
# #                     "2": [730,230],
# #                     "1": [920,230],
# #                     "0": [1110,230],

# #                     "6": [160,460],
# #                     "7": [350,460],
# #                     "8": [540,460],
# #                     "9": [730,460],
# #                     "10":[920,460],
# #                     "11":[1110,460]

# #                 }
# #             }

# #         with open(path, "r") as f:
# #             return json.load(f)

# #     # =====================================================
# #     # MAIN SCAN
# #     # =====================================================

# #     def scan_board(self, frame):

# #         board = []

# #         for i in range(12):

# #             x, y = self.calibration["pits"][str(i)]

# #             seeds = self.detect_pit(
# #                 frame,
# #                 x,
# #                 y
# #             )

# #             board.append(seeds)

# #         if self.debug_enabled:
# #             self.save_debug(frame, board)

# #         return board

# #     def detect_board(self, frame):
# #         return self.scan_board(frame)

# #     # =====================================================
# #     # PIT DETECTION
# #     # =====================================================

# #     def detect_pit(self, frame, x, y):

# #         r = self.pit_radius

# #         h, w = frame.shape[:2]

# #         x1 = max(0, x - r)
# #         y1 = max(0, y - r)

# #         x2 = min(w, x + r)
# #         y2 = min(h, y + r)

# #         roi = frame[y1:y2, x1:x2]

# #         if roi.size == 0:
# #             return 0

# #         return self.count_seeds(roi)

# #     # =====================================================
# #     # SEED COUNTING
# #     # =====================================================

# #     def count_seeds(self, roi):

# #         hsv = cv2.cvtColor(
# #             roi,
# #             cv2.COLOR_BGR2HSV
# #         )


# #         # ---------------------------------------
# #         # Circular mask
# #         # ---------------------------------------

# #         mask = np.zeros(
# #             hsv.shape[:2],
# #             dtype=np.uint8
# #         )

# #         center = (
# #             mask.shape[1] // 2,
# #             mask.shape[0] // 2
# #         )

# #         radius = min(mask.shape) // 2 - 4

# #         cv2.circle(
# #             mask,
# #             center,
# #             radius,
# #             255,
# #             -1
# #         )


# #         # ---------------------------------------
# #         # HSV seed detection
# #         # ---------------------------------------

# #         seed_mask = cv2.inRange(
# #             hsv,
# #             self.seed_lower,
# #             self.seed_upper
# #         )


# #         seed_mask = cv2.bitwise_and(
# #             seed_mask,
# #             mask
# #         )


# #         # ---------------------------------------
# #         # Remove noise
# #         # ---------------------------------------

# #         kernel = np.ones(
# #             (3,3),
# #             np.uint8
# #         )


# #         seed_mask = cv2.morphologyEx(
# #             seed_mask,
# #             cv2.MORPH_OPEN,
# #             kernel,
# #             iterations=1
# #         )


# #         seed_mask = cv2.morphologyEx(
# #             seed_mask,
# #             cv2.MORPH_CLOSE,
# #             kernel,
# #             iterations=1
# #         )



# #         # =======================================
# #         # WATERSHED SEPARATION
# #         # =======================================

# #         # Distance from background
# #         distance = cv2.distanceTransform(
# #             seed_mask,
# #             cv2.DIST_L2,
# #             5
# #         )


# #         # Find seed centers
# #         _, sure_fg = cv2.threshold(
# #             distance,
# #             0.35 * distance.max(),
# #             255,
# #             0
# #         )


# #         sure_fg = np.uint8(
# #             sure_fg
# #         )


# #         # Find unknown region
# #         sure_bg = cv2.dilate(
# #             seed_mask,
# #             kernel,
# #             iterations=3
# #         )


# #         unknown = cv2.subtract(
# #             sure_bg,
# #             sure_fg
# #         )


# #         # Label markers
# #         _, markers = cv2.connectedComponents(
# #             sure_fg
# #         )


# #         # Add one because watershed background is 0
# #         markers = markers + 1


# #         # Mark unknown pixels as zero
# #         markers[unknown == 255] = 0



# #         # Apply watershed
# #         roi_copy = roi.copy()

# #         markers = cv2.watershed(
# #             roi_copy,
# #             markers
# #         )


# #         # ---------------------------------------
# #         # Count separated objects
# #         # ---------------------------------------

# #         seed_count = 0


# #         for label in np.unique(markers):

# #             # watershed boundaries
# #             if label <= 1:
# #                 continue


# #             component = np.uint8(
# #                 markers == label
# #             )


# #             contours, _ = cv2.findContours(
# #                 component,
# #                 cv2.RETR_EXTERNAL,
# #                 cv2.CHAIN_APPROX_SIMPLE
# #             )


# #             if len(contours)==0:
# #                 continue


# #             contour = contours[0]


# #             area=cv2.contourArea(
# #                 contour
# #             )


# #             if area < self.min_seed_area:
# #                 continue


# #             if area > self.max_seed_area:
# #                 continue



# #             perimeter=cv2.arcLength(
# #                 contour,
# #                 True
# #             )


# #             if perimeter == 0:
# #                 continue



# #             circularity = (
# #                 4*np.pi*area
# #             )/(perimeter*perimeter)



# #             if circularity < 0.35:
# #                 continue


# #             seed_count += 1



# #         return seed_count
# #         # =====================================================
# #     # DEBUG IMAGE
# #     # =====================================================

# #     def save_debug(self, frame, board):

# #         image = self.annotate_frame(frame, board)

# #         cv2.imwrite(
# #             "games/oware/debug_board.png",
# #             image
# #         )

# #     # =====================================================
# #     # DRAW RESULTS
# #     # =====================================================

# #     def annotate_frame(self, frame, board):

# #         image = frame.copy()

# #         for i in range(12):

# #             x, y = self.calibration["pits"][str(i)]

# #             cv2.circle(
# #                 image,
# #                 (x, y),
# #                 self.pit_radius,
# #                 (0, 255, 0),
# #                 2
# #             )

# #             cv2.putText(
# #                 image,
# #                 str(board[i]),
# #                 (x - 12, y - 15),
# #                 cv2.FONT_HERSHEY_SIMPLEX,
# #                 0.8,
# #                 (255, 0, 0),
# #                 2
# #             )

# #         return image

# #     # =====================================================
# #     # LIVE CAMERA TEST
# #     # =====================================================

# #     def test_camera(self):

# #         cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# #         cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
# #         cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# #         print(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
# #         print(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# #         while True:

# #             ret, frame = cap.read()

# #             if not ret:
# #                 break

# #             board = self.scan_board(frame)

# #             annotated = self.annotate_frame(
# #                 frame,
# #                 board
# #             )

# #             cv2.imshow(
# #                 "Oware Vision",
# #                 annotated
# #             )

# #             print(board)

# #             key = cv2.waitKey(1)

# #             if key == 27:
# #                 break

# #         cap.release()
# #         cv2.destroyAllWindows()


# # if __name__ == "__main__":

# #     vision = OwareVision()
# #     vision.test_camera()






# """
# Oware board vision: counts seeds in each pit from a camera frame.

# Fixes applied vs. the original version:
#   - Calibration/debug paths are resolved relative to THIS FILE, not the
#     current working directory, and parent folders are auto-created.
#   - Camera backend selection no longer hardcodes cv2.CAP_DSHOW (Windows-only);
#     it now falls back gracefully and checks cap.isOpened().
#   - Default seed HSV range was far too broad (H 0-84, full S/V), which will
#     happily match a wooden board as "seed" pixels. Tightened default and,
#     more importantly, added an interactive HSV calibration tool so you can
#     tune it live against your actual board instead of guessing numbers.
#   - Added an interactive pit-position calibration tool (click the 12 pits).
#   - debug_enabled is now actually settable (constructor arg), instead of
#     being hardcoded False with no way to turn it on.
#   - Calibration file now also stores seed HSV range / pit radius / area
#     thresholds, so all tuning lives in one calibration.json instead of
#     being split between code and file.
# """

# import cv2
# import json
# import numpy as np
# from pathlib import Path


# BASE_DIR = Path(__file__).resolve().parent
# DEFAULT_CALIBRATION_PATH = BASE_DIR / "calibration.json"
# DEFAULT_DEBUG_IMAGE_PATH = BASE_DIR / "debug_board.png"

# DEFAULT_PITS = {
#     "5": [160, 230], "4": [350, 230], "3": [540, 230],
#     "2": [730, 230], "1": [920, 230], "0": [1110, 230],
#     "6": [160, 460], "7": [350, 460], "8": [540, 460],
#     "9": [730, 460], "10": [920, 460], "11": [1110, 460],
# }

# # Tighter starting point than the original 0-84/0-255/0-255 (which matches
# # almost anything, including most wooden boards). Still meant to be tuned
# # per-board with calibrate_hsv().
# DEFAULT_SEED_LOWER = [0, 0, 0]
# DEFAULT_SEED_UPPER = [40, 255, 90]


# class OwareVision:

#     def __init__(self, calibration_path=None, debug_enabled=False):

#         self.debug_enabled = debug_enabled

#         self.calibration_path = Path(calibration_path) if calibration_path else DEFAULT_CALIBRATION_PATH

#         self.calibration = self.load_calibration()

#         self.pit_radius = self.calibration.get("pit_radius", 90)

#         self.seed_lower = np.array(self.calibration.get("seed_lower", DEFAULT_SEED_LOWER))
#         self.seed_upper = np.array(self.calibration.get("seed_upper", DEFAULT_SEED_UPPER))

#         self.min_seed_area = self.calibration.get("min_seed_area", 30)
#         self.max_seed_area = self.calibration.get("max_seed_area", 2000)
#         self.watershed_peak_ratio = self.calibration.get("watershed_peak_ratio", 0.35)
#         self.min_circularity = self.calibration.get("min_circularity", 0.35)

#     # =====================================================
#     # CALIBRATION LOAD / SAVE
#     # =====================================================

#     def load_calibration(self):

#         if not self.calibration_path.exists():
#             return {"pits": DEFAULT_PITS}

#         with open(self.calibration_path, "r") as f:
#             data = json.load(f)

#         data.setdefault("pits", DEFAULT_PITS)
#         return data

#     def save_calibration(self):

#         self.calibration["pits"] = self.calibration.get("pits", DEFAULT_PITS)
#         self.calibration["seed_lower"] = list(int(v) for v in self.seed_lower)
#         self.calibration["seed_upper"] = list(int(v) for v in self.seed_upper)
#         self.calibration["pit_radius"] = self.pit_radius
#         self.calibration["min_seed_area"] = self.min_seed_area
#         self.calibration["max_seed_area"] = self.max_seed_area
#         self.calibration["watershed_peak_ratio"] = self.watershed_peak_ratio
#         self.calibration["min_circularity"] = self.min_circularity

#         self.calibration_path.parent.mkdir(parents=True, exist_ok=True)

#         with open(self.calibration_path, "w") as f:
#             json.dump(self.calibration, f, indent=2)

#         print(f"Saved calibration to {self.calibration_path}")

#     # =====================================================
#     # MAIN SCAN
#     # =====================================================

#     def scan_board(self, frame):

#         board = []

#         for i in range(12):
#             x, y = self.calibration["pits"][str(i)]
#             seeds = self.detect_pit(frame, x, y)
#             board.append(seeds)

#         if self.debug_enabled:
#             self.save_debug(frame, board)

#         return board

#     def detect_board(self, frame):
#         return self.scan_board(frame)

#     # =====================================================
#     # PIT DETECTION
#     # =====================================================

#     def detect_pit(self, frame, x, y):

#         r = self.pit_radius
#         h, w = frame.shape[:2]

#         x1 = max(0, x - r)
#         y1 = max(0, y - r)
#         x2 = min(w, x + r)
#         y2 = min(h, y + r)

#         roi = frame[y1:y2, x1:x2]

#         if roi.size == 0:
#             return 0

#         return self.count_seeds(roi)

#     # =====================================================
#     # SEED COUNTING
#     # =====================================================

#     def count_seeds(self, roi):

#         hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

#         # Circular mask so we only look inside the pit, not its surroundings
#         mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
#         center = (mask.shape[1] // 2, mask.shape[0] // 2)
#         radius = min(mask.shape) // 2 - 4
#         cv2.circle(mask, center, radius, 255, -1)

#         seed_mask = cv2.inRange(hsv, self.seed_lower, self.seed_upper)
#         seed_mask = cv2.bitwise_and(seed_mask, mask)

#         kernel = np.ones((3, 3), np.uint8)
#         seed_mask = cv2.morphologyEx(seed_mask, cv2.MORPH_OPEN, kernel, iterations=1)
#         seed_mask = cv2.morphologyEx(seed_mask, cv2.MORPH_CLOSE, kernel, iterations=1)

#         # If nothing survived the threshold, bail out early (avoids a
#         # degenerate all-zero distance transform going through watershed
#         # for no reason).
#         if cv2.countNonZero(seed_mask) == 0:
#             return 0

#         # ---- Watershed separation of touching seeds ----
#         distance = cv2.distanceTransform(seed_mask, cv2.DIST_L2, 5)

#         _, sure_fg = cv2.threshold(
#             distance, self.watershed_peak_ratio * distance.max(), 255, 0
#         )
#         sure_fg = np.uint8(sure_fg)

#         sure_bg = cv2.dilate(seed_mask, kernel, iterations=3)
#         unknown = cv2.subtract(sure_bg, sure_fg)

#         _, markers = cv2.connectedComponents(sure_fg)
#         markers = markers + 1
#         markers[unknown == 255] = 0

#         roi_copy = roi.copy()
#         markers = cv2.watershed(roi_copy, markers)

#         seed_count = 0

#         for label in np.unique(markers):

#             if label <= 1:  # -1 = watershed boundary, 1 = background
#                 continue

#             component = np.uint8(markers == label)

#             contours, _ = cv2.findContours(
#                 component, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
#             )

#             if not contours:
#                 continue

#             # A watershed region can occasionally split into more than one
#             # external contour; check all of them instead of only the first.
#             for contour in contours:

#                 area = cv2.contourArea(contour)

#                 if area < self.min_seed_area or area > self.max_seed_area:
#                     continue

#                 perimeter = cv2.arcLength(contour, True)

#                 if perimeter == 0:
#                     continue

#                 circularity = (4 * np.pi * area) / (perimeter * perimeter)

#                 if circularity < self.min_circularity:
#                     continue

#                 seed_count += 1

#         return seed_count

#     # =====================================================
#     # DEBUG IMAGE
#     # =====================================================

#     def save_debug(self, frame, board, path=None):

#         image = self.annotate_frame(frame, board)

#         out_path = Path(path) if path else DEFAULT_DEBUG_IMAGE_PATH
#         out_path.parent.mkdir(parents=True, exist_ok=True)

#         ok = cv2.imwrite(str(out_path), image)
#         if not ok:
#             print(f"Warning: failed to write debug image to {out_path}")

#     # =====================================================
#     # DRAW RESULTS
#     # =====================================================

#     def annotate_frame(self, frame, board):

#         image = frame.copy()

#         for i in range(12):
#             x, y = self.calibration["pits"][str(i)]

#             cv2.circle(image, (x, y), self.pit_radius, (0, 255, 0), 2)
#             cv2.putText(
#                 image, str(board[i]), (x - 12, y - 15),
#                 cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2
#             )

#         return image

#     # =====================================================
#     # CAMERA HELPERS
#     # =====================================================

#     @staticmethod
#     def open_camera(index=0, width=1280, height=720):
#         """Open a camera without assuming Windows/DSHOW is available."""

#         import platform

#         if platform.system() == "Windows":
#             cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
#         else:
#             cap = cv2.VideoCapture(index)

#         if not cap.isOpened():
#             # Fall back to default backend if the preferred one failed
#             cap = cv2.VideoCapture(index)

#         if not cap.isOpened():
#             raise RuntimeError(f"Could not open camera index {index}")

#         cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
#         cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

#         return cap

#     # =====================================================
#     # LIVE CAMERA TEST
#     # =====================================================

#     def test_camera(self, camera_index=0):

#         cap = self.open_camera(camera_index)

#         print(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#         print(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

#         while True:

#             ret, frame = cap.read()

#             if not ret:
#                 print("Failed to read frame from camera")
#                 break

#             board = self.scan_board(frame)
#             annotated = self.annotate_frame(frame, board)

#             cv2.imshow("Oware Vision", annotated)
#             print(board)

#             key = cv2.waitKey(1)
#             if key == 27:  # Esc
#                 break

#         cap.release()
#         cv2.destroyAllWindows()

#     # =====================================================
#     # CALIBRATION: PIT POSITIONS (click to set)
#     # =====================================================

#     def calibrate_pits(self, frame):
#         """
#         Click on each of the 12 pit centers in order (matching the layout
#         in DEFAULT_PITS: top row 5,4,3,2,1,0 then bottom row 6..11).
#         Press 'r' to restart, 's' to save once all 12 are placed, Esc to quit
#         without saving.
#         """

#         points = []
#         display = frame.copy()

#         window = "Calibrate Pits - click 12 pit centers, s=save, r=reset, Esc=quit"

#         def on_click(event, x, y, flags, param):
#             if event == cv2.EVENT_LBUTTONDOWN and len(points) < 12:
#                 points.append((x, y))

#         cv2.namedWindow(window)
#         cv2.setMouseCallback(window, on_click)

#         while True:
#             display = frame.copy()

#             for idx, (x, y) in enumerate(points):
#                 cv2.circle(display, (x, y), 6, (0, 255, 0), -1)
#                 cv2.putText(display, str(idx), (x + 8, y - 8),
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

#             cv2.imshow(window, display)
#             key = cv2.waitKey(20) & 0xFF

#             if key == ord('r'):
#                 points = []
#             elif key == ord('s') and len(points) == 12:
#                 order = ["5", "4", "3", "2", "1", "0", "6", "7", "8", "9", "10", "11"]
#                 self.calibration["pits"] = {
#                     order[i]: [int(px), int(py)] for i, (px, py) in enumerate(points)
#                 }
#                 self.save_calibration()
#                 break
#             elif key == 27:
#                 break

#         cv2.destroyWindow(window)

#     # =====================================================
#     # CALIBRATION: SEED HSV RANGE (live trackbars)
#     # =====================================================

#     def calibrate_hsv(self, frame):
#         """
#         Live HSV threshold tuner. Point the camera at a representative pit
#         (with a known seed count in it) and adjust sliders until the mask
#         on the right cleanly shows only seeds, not the board. Press 's' to
#         save, Esc to quit without saving.
#         """

#         window = "Calibrate HSV - s=save, Esc=quit"
#         cv2.namedWindow(window)

#         def nothing(_):
#             pass

#         h_lo, s_lo, v_lo = (int(v) for v in self.seed_lower)
#         h_hi, s_hi, v_hi = (int(v) for v in self.seed_upper)

#         cv2.createTrackbar("H min", window, h_lo, 179, nothing)
#         cv2.createTrackbar("H max", window, h_hi, 179, nothing)
#         cv2.createTrackbar("S min", window, s_lo, 255, nothing)
#         cv2.createTrackbar("S max", window, s_hi, 255, nothing)
#         cv2.createTrackbar("V min", window, v_lo, 255, nothing)
#         cv2.createTrackbar("V max", window, v_hi, 255, nothing)

#         while True:
#             h_lo = cv2.getTrackbarPos("H min", window)
#             h_hi = cv2.getTrackbarPos("H max", window)
#             s_lo = cv2.getTrackbarPos("S min", window)
#             s_hi = cv2.getTrackbarPos("S max", window)
#             v_lo = cv2.getTrackbarPos("V min", window)
#             v_hi = cv2.getTrackbarPos("V max", window)

#             lower = np.array([h_lo, s_lo, v_lo])
#             upper = np.array([h_hi, s_hi, v_hi])

#             hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
#             mask = cv2.inRange(hsv, lower, upper)
#             mask_bgr = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

#             preview = np.hstack([frame, mask_bgr])
#             cv2.imshow(window, preview)

#             key = cv2.waitKey(20) & 0xFF

#             if key == ord('s'):
#                 self.seed_lower = np.array([h_lo, s_lo, v_lo])
#                 self.seed_upper = np.array([h_hi, s_hi, v_hi])
#                 self.save_calibration()
#                 break
#             elif key == 27:
#                 break

#         cv2.destroyWindow(window)


# if __name__ == "__main__":

#     vision = OwareVision(debug_enabled=True)
#     vision.test_camera()

"""
Oware board vision: counts seeds in each pit from a camera frame.

Fixes applied vs. the original version:
  - Calibration/debug paths are resolved relative to THIS FILE, not the
    current working directory, and parent folders are auto-created.
  - Camera backend selection no longer hardcodes cv2.CAP_DSHOW (Windows-only);
    it now falls back gracefully and checks cap.isOpened().
  - Default seed HSV range was far too broad (H 0-84, full S/V), which will
    happily match a wooden board as "seed" pixels. Tightened default and,
    more importantly, added an interactive HSV calibration tool so you can
    tune it live against your actual board instead of guessing numbers.
  - Added an interactive pit-position calibration tool (click the 12 pits).
  - debug_enabled is now actually settable (constructor arg), instead of
    being hardcoded False with no way to turn it on.
  - Calibration file now also stores seed HSV range / pit radius / area
    thresholds, so all tuning lives in one calibration.json instead of
    being split between code and file.
"""

import cv2
import json
import numpy as np
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DEFAULT_CALIBRATION_PATH = BASE_DIR / "calibration.json"
DEFAULT_DEBUG_IMAGE_PATH = BASE_DIR / "debug_board.png"

DEFAULT_PITS = {
    "5": [160, 230], "4": [350, 230], "3": [540, 230],
    "2": [730, 230], "1": [920, 230], "0": [1110, 230],
    "6": [160, 460], "7": [350, 460], "8": [530, 460],
    "9": [730, 460], "10": [920, 460], "11": [1110, 460],
}

# Tuned for pale/cream wooden seeds against a dark pit (e.g. dark blue
# molded pits): seeds are low-to-mid saturation, high brightness, warm hue.
# Still meant to be tuned per-board/lighting with calibrate_hsv().
DEFAULT_SEED_LOWER = [0, 0, 123]
DEFAULT_SEED_UPPER = [67, 70, 255]


class OwareVision:

    def __init__(self, calibration_path=None, debug_enabled=False):

        self.debug_enabled = debug_enabled

        self.calibration_path = Path(calibration_path) if calibration_path else DEFAULT_CALIBRATION_PATH

        self.calibration = self.load_calibration()

        self.pit_radius = self.calibration.get("pit_radius", 90)

        self.seed_lower = np.array(self.calibration.get("seed_lower", DEFAULT_SEED_LOWER))
        self.seed_upper = np.array(self.calibration.get("seed_upper", DEFAULT_SEED_UPPER))

        self.min_seed_area = self.calibration.get("min_seed_area", 103)
        self.max_seed_area = self.calibration.get("max_seed_area", 1920)
        self.watershed_peak_ratio = self.calibration.get("watershed_peak_ratio", 0.66)
        self.min_circularity = self.calibration.get("min_circularity", 0.17)

    # =====================================================
    # CALIBRATION LOAD / SAVE
    # =====================================================

    def load_calibration(self):

        if not self.calibration_path.exists():
            return {"pits": DEFAULT_PITS}

        with open(self.calibration_path, "r") as f:
            data = json.load(f)

        data.setdefault("pits", DEFAULT_PITS)
        return data

    def save_calibration(self):

        self.calibration["pits"] = self.calibration.get("pits", DEFAULT_PITS)
        self.calibration["seed_lower"] = list(int(v) for v in self.seed_lower)
        self.calibration["seed_upper"] = list(int(v) for v in self.seed_upper)
        self.calibration["pit_radius"] = self.pit_radius
        self.calibration["min_seed_area"] = self.min_seed_area
        self.calibration["max_seed_area"] = self.max_seed_area
        self.calibration["watershed_peak_ratio"] = self.watershed_peak_ratio
        self.calibration["min_circularity"] = self.min_circularity

        self.calibration_path.parent.mkdir(parents=True, exist_ok=True)

        with open(self.calibration_path, "w") as f:
            json.dump(self.calibration, f, indent=2)

        print(f"Saved calibration to {self.calibration_path}")

    # =====================================================
    # MAIN SCAN
    # =====================================================

    def scan_board(self, frame, return_contours=False):
        """
        Scan all 12 pits. If return_contours=True, also returns a list
        (length 12) of accepted seed contours per pit, already translated
        into full-frame coordinates, for visualization/debugging.
        """

        board = []
        contours_per_pit = []

        for i in range(12):
            x, y = self.calibration["pits"][str(i)]

            if return_contours:
                seeds, contours = self.detect_pit(frame, x, y, return_contours=True)
                contours_per_pit.append(contours)
            else:
                seeds = self.detect_pit(frame, x, y)

            board.append(seeds)

        if self.debug_enabled:
            self.save_debug(frame, board)

        if return_contours:
            return board, contours_per_pit

        return board

    def detect_board(self, frame):
        return self.scan_board(frame)

    # =====================================================
    # PIT DETECTION
    # =====================================================

    def detect_pit(self, frame, x, y, return_contours=False):

        r = self.pit_radius
        h, w = frame.shape[:2]

        x1 = max(0, x - r)
        y1 = max(0, y - r)
        x2 = min(w, x + r)
        y2 = min(h, y + r)

        roi = frame[y1:y2, x1:x2]

        if roi.size == 0:
            return (0, []) if return_contours else 0

        if return_contours:
            count, contours = self.count_seeds(roi, return_contours=True)
            # translate contour points from ROI-local coords into full-frame coords
            translated = [contour + np.array([[x1, y1]]) for contour in contours]
            return count, translated

        return self.count_seeds(roi)

    # =====================================================
    # SEED COUNTING
    # =====================================================

    def count_seeds(self, roi, return_contours=False):

        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

        # Circular mask so we only look inside the pit, not its surroundings
        mask = np.zeros(hsv.shape[:2], dtype=np.uint8)
        center = (mask.shape[1] // 2, mask.shape[0] // 2)
        radius = min(mask.shape) // 2 - 4
        cv2.circle(mask, center, radius, 255, -1)

        seed_mask = cv2.inRange(hsv, self.seed_lower, self.seed_upper)
        seed_mask = cv2.bitwise_and(seed_mask, mask)

        kernel = np.ones((3, 3), np.uint8)
        seed_mask = cv2.morphologyEx(seed_mask, cv2.MORPH_OPEN, kernel, iterations=1)
        seed_mask = cv2.morphologyEx(seed_mask, cv2.MORPH_CLOSE, kernel, iterations=1)

        # If nothing survived the threshold, bail out early (avoids a
        # degenerate all-zero distance transform going through watershed
        # for no reason).
        if cv2.countNonZero(seed_mask) == 0:
            return (0, []) if return_contours else 0

        # ---- Watershed separation of touching seeds ----
        distance = cv2.distanceTransform(seed_mask, cv2.DIST_L2, 5)

        _, sure_fg = cv2.threshold(
            distance, self.watershed_peak_ratio * distance.max(), 255, 0
        )
        sure_fg = np.uint8(sure_fg)

        sure_bg = cv2.dilate(seed_mask, kernel, iterations=3)
        unknown = cv2.subtract(sure_bg, sure_fg)

        _, markers = cv2.connectedComponents(sure_fg)
        markers = markers + 1
        markers[unknown == 255] = 0

        roi_copy = roi.copy()
        markers = cv2.watershed(roi_copy, markers)

        seed_count = 0
        accepted_contours = []

        for label in np.unique(markers):

            if label <= 1:  # -1 = watershed boundary, 1 = background
                continue

            component = np.uint8(markers == label)

            contours, _ = cv2.findContours(
                component, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )

            if not contours:
                continue

            # A watershed region can occasionally split into more than one
            # external contour; check all of them instead of only the first.
            for contour in contours:

                area = cv2.contourArea(contour)

                if area < self.min_seed_area or area > self.max_seed_area:
                    continue

                perimeter = cv2.arcLength(contour, True)

                if perimeter == 0:
                    continue

                circularity = (4 * np.pi * area) / (perimeter * perimeter)

                if circularity < self.min_circularity:
                    continue

                seed_count += 1
                accepted_contours.append(contour)

        if return_contours:
            return seed_count, accepted_contours

        return seed_count

    # =====================================================
    # DEBUG IMAGE
    # =====================================================

    def save_debug(self, frame, board, path=None):

        image = self.annotate_frame(frame, board)

        out_path = Path(path) if path else DEFAULT_DEBUG_IMAGE_PATH
        out_path.parent.mkdir(parents=True, exist_ok=True)

        ok = cv2.imwrite(str(out_path), image)
        if not ok:
            print(f"Warning: failed to write debug image to {out_path}")

    # =====================================================
    # DRAW RESULTS
    # =====================================================

    def annotate_frame(self, frame, board, contours_per_pit=None,
                        contour_color=(0, 0, 255), contour_thickness=2):
        """
        Draw pit circles + seed counts. If contours_per_pit is given (as
        returned by scan_board(frame, return_contours=True)), also draws
        the individual detected seed contours in contour_color.
        """

        image = frame.copy()

        for i in range(12):
            x, y = self.calibration["pits"][str(i)]

            cv2.circle(image, (x, y), self.pit_radius, (0, 255, 0), 2)
            cv2.putText(
                image, str(board[i]), (x - 12, y - 15),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2
            )

            if contours_per_pit is not None:
                cv2.drawContours(
                    image, contours_per_pit[i], -1, contour_color, contour_thickness
                )

        return image

    # =====================================================
    # CAMERA HELPERS
    # =====================================================

    @staticmethod
    def open_camera(index=0, width=1280, height=720):
        """Open a camera without assuming Windows/DSHOW is available."""

        import platform

        if platform.system() == "Windows":
            cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
        else:
            cap = cv2.VideoCapture(index)

        if not cap.isOpened():
            # Fall back to default backend if the preferred one failed
            cap = cv2.VideoCapture(index)

        if not cap.isOpened():
            raise RuntimeError(f"Could not open camera index {index}")

        cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

        return cap

    # =====================================================
    # LIVE CAMERA TEST
    # =====================================================

    def test_camera(self, camera_index=0):

        cap = self.open_camera(camera_index)

        print(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        print(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        while True:

            ret, frame = cap.read()

            if not ret:
                print("Failed to read frame from camera")
                break

            board, contours_per_pit = self.scan_board(frame, return_contours=True)
            annotated = self.annotate_frame(frame, board, contours_per_pit)

            cv2.imshow("Oware Vision", annotated)
            print(board)

            key = cv2.waitKey(1)
            if key == 27:  # Esc
                break

        cap.release()
        cv2.destroyAllWindows()

    # =====================================================
    # CALIBRATION: PIT POSITIONS (click to set)
    # =====================================================

    def calibrate_pits(self, frame):
        """
        Click on each of the 12 pit centers in order (matching the layout
        in DEFAULT_PITS: top row 5,4,3,2,1,0 then bottom row 6..11).
        Press 'r' to restart, 's' to save once all 12 are placed, Esc to quit
        without saving.
        """

        points = []
        display = frame.copy()

        window = "Calibrate Pits - click 12 pit centers, s=save, r=reset, Esc=quit"

        def on_click(event, x, y, flags, param):
            if event == cv2.EVENT_LBUTTONDOWN and len(points) < 12:
                points.append((x, y))

        cv2.namedWindow(window)
        cv2.setMouseCallback(window, on_click)

        while True:
            display = frame.copy()

            for idx, (x, y) in enumerate(points):
                cv2.circle(display, (x, y), 6, (0, 255, 0), -1)
                cv2.putText(display, str(idx), (x + 8, y - 8),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

            cv2.imshow(window, display)
            key = cv2.waitKey(20) & 0xFF

            if key == ord('r'):
                points = []
            elif key == ord('s') and len(points) == 12:
                order = ["5", "4", "3", "2", "1", "0", "6", "7", "8", "9", "10", "11"]
                self.calibration["pits"] = {
                    order[i]: [int(px), int(py)] for i, (px, py) in enumerate(points)
                }
                self.save_calibration()
                break
            elif key == 27:
                break

        cv2.destroyWindow(window)

    # =====================================================
    # CALIBRATION: SEED HSV RANGE (live trackbars)
    # =====================================================

    def calibrate_hsv(self, frame):
        """
        Live HSV threshold tuner. Point the camera at a representative pit
        (with a known seed count in it) and adjust sliders until the mask
        on the right cleanly shows only seeds, not the board. Press 's' to
        save, Esc to quit without saving.
        """

        window = "Calibrate HSV - s=save, Esc=quit"
        cv2.namedWindow(window)

        def nothing(_):
            pass

        h_lo, s_lo, v_lo = (int(v) for v in self.seed_lower)
        h_hi, s_hi, v_hi = (int(v) for v in self.seed_upper)

        cv2.createTrackbar("H min", window, h_lo, 179, nothing)
        cv2.createTrackbar("H max", window, h_hi, 179, nothing)
        cv2.createTrackbar("S min", window, s_lo, 255, nothing)
        cv2.createTrackbar("S max", window, s_hi, 255, nothing)
        cv2.createTrackbar("V min", window, v_lo, 255, nothing)
        cv2.createTrackbar("V max", window, v_hi, 255, nothing)

        while True:
            h_lo = cv2.getTrackbarPos("H min", window)
            h_hi = cv2.getTrackbarPos("H max", window)
            s_lo = cv2.getTrackbarPos("S min", window)
            s_hi = cv2.getTrackbarPos("S max", window)
            v_lo = cv2.getTrackbarPos("V min", window)
            v_hi = cv2.getTrackbarPos("V max", window)

            lower = np.array([h_lo, s_lo, v_lo])
            upper = np.array([h_hi, s_hi, v_hi])

            hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
            mask = cv2.inRange(hsv, lower, upper)
            mask_bgr = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

            preview = np.hstack([frame, mask_bgr])
            cv2.imshow(window, preview)

            key = cv2.waitKey(20) & 0xFF

            if key == ord('s'):
                self.seed_lower = np.array([h_lo, s_lo, v_lo])
                self.seed_upper = np.array([h_hi, s_hi, v_hi])
                self.save_calibration()
                break
            elif key == 27:
                break

        cv2.destroyWindow(window)


if __name__ == "__main__":

    vision = OwareVision(debug_enabled=True)
    vision.test_camera()