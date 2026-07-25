"""
Interactive calibration/test tool for OwareVision.

Shows the live camera (or a static image) with trackbars for every tunable
parameter (HSV range, pit radius, seed area bounds, circularity, watershed
peak ratio). As you drag sliders you immediately see:
  - the annotated board with a live seed count per pit
  - the raw seed mask for the whole frame (what pixels count as "seed")

Usage:
    python calibrate_oware.py                # use webcam 0
    python calibrate_oware.py --camera 1      # use webcam 1
    python calibrate_oware.py --image board.jpg   # use a static photo instead

Keys:
    p   - enter pit-position calibration (click the 12 pits, in the order
          top row 5,4,3,2,1,0 then bottom row 6,7,8,9,10,11)
    s   - save all current slider values + pit positions to calibration.json
    r   - reload calibration.json (discard unsaved slider changes)
    Esc - quit
"""

import argparse
import cv2
import numpy as np

from games.oware.vision import OwareVision


WINDOW_MAIN = "Oware Calibration - board + counts"
WINDOW_MASK = "Seed mask (whole frame)"
WINDOW_SLIDERS = "Sliders"


def nothing(_):
    pass


def build_trackbars(vision: OwareVision):
    cv2.namedWindow(WINDOW_SLIDERS, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(WINDOW_SLIDERS, 420, 400)

    h_lo, s_lo, v_lo = (int(v) for v in vision.seed_lower)
    h_hi, s_hi, v_hi = (int(v) for v in vision.seed_upper)

    cv2.createTrackbar("H min", WINDOW_SLIDERS, h_lo, 179, nothing)
    cv2.createTrackbar("H max", WINDOW_SLIDERS, h_hi, 179, nothing)
    cv2.createTrackbar("S min", WINDOW_SLIDERS, s_lo, 255, nothing)
    cv2.createTrackbar("S max", WINDOW_SLIDERS, s_hi, 255, nothing)
    cv2.createTrackbar("V min", WINDOW_SLIDERS, v_lo, 255, nothing)
    cv2.createTrackbar("V max", WINDOW_SLIDERS, v_hi, 255, nothing)

    cv2.createTrackbar("Pit radius", WINDOW_SLIDERS, vision.pit_radius, 200, nothing)
    cv2.createTrackbar("Min area", WINDOW_SLIDERS, vision.min_seed_area, 500, nothing)
    cv2.createTrackbar("Max area", WINDOW_SLIDERS, vision.max_seed_area, 5000, nothing)

    # stored as 0-100, converted to 0.0-1.0 fractions when read
    cv2.createTrackbar("Circularity x100", WINDOW_SLIDERS,
                        int(vision.min_circularity * 100), 100, nothing)
    cv2.createTrackbar("Watershed peak x100", WINDOW_SLIDERS,
                        int(vision.watershed_peak_ratio * 100), 100, nothing)


def read_trackbars(vision: OwareVision):
    h_lo = cv2.getTrackbarPos("H min", WINDOW_SLIDERS)
    h_hi = cv2.getTrackbarPos("H max", WINDOW_SLIDERS)
    s_lo = cv2.getTrackbarPos("S min", WINDOW_SLIDERS)
    s_hi = cv2.getTrackbarPos("S max", WINDOW_SLIDERS)
    v_lo = cv2.getTrackbarPos("V min", WINDOW_SLIDERS)
    v_hi = cv2.getTrackbarPos("V max", WINDOW_SLIDERS)

    vision.seed_lower = np.array([h_lo, s_lo, v_lo])
    vision.seed_upper = np.array([h_hi, s_hi, v_hi])

    vision.pit_radius = max(5, cv2.getTrackbarPos("Pit radius", WINDOW_SLIDERS))
    vision.min_seed_area = cv2.getTrackbarPos("Min area", WINDOW_SLIDERS)
    vision.max_seed_area = max(vision.min_seed_area + 1,
                                cv2.getTrackbarPos("Max area", WINDOW_SLIDERS))

    vision.min_circularity = cv2.getTrackbarPos("Circularity x100", WINDOW_SLIDERS) / 100.0
    vision.watershed_peak_ratio = max(
        0.01, cv2.getTrackbarPos("Watershed peak x100", WINDOW_SLIDERS) / 100.0
    )


def whole_frame_mask(vision: OwareVision, frame, contours_per_pit=None):
    """Build a full-frame seed mask purely for visualization (not per-pit),
    so you can see at a glance whether the board itself is being picked up.
    Also overlays pit boundaries and, if given, the accepted seed contours
    (in yellow, since they'd be invisible in red on top of a white mask)."""

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, vision.seed_lower, vision.seed_upper)

    mask_bgr = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

    for i in range(12):
        x, y = vision.calibration["pits"][str(i)]
        cv2.circle(mask_bgr, (x, y), vision.pit_radius, (0, 255, 0), 1)

    if contours_per_pit is not None:
        for i in range(12):
            cv2.drawContours(mask_bgr, contours_per_pit[i], -1, (0, 255, 255), 2)

    return mask_bgr


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--camera", type=int, default=0, help="Camera index")
    parser.add_argument("--image", type=str, default=None,
                         help="Path to a static image instead of a live camera")
    args = parser.parse_args()

    vision = OwareVision()

    cap = None
    static_frame = None

    if args.image:
        static_frame = cv2.imread(args.image)
        if static_frame is None:
            raise FileNotFoundError(f"Could not read image: {args.image}")
    else:
        cap = vision.open_camera(args.camera)

    cv2.namedWindow(WINDOW_MAIN)
    build_trackbars(vision)

    print("Keys: p=calibrate pits  s=save  r=reload  Esc=quit")

    while True:

        if static_frame is not None:
            frame = static_frame.copy()
        else:
            ret, frame = cap.read()
            if not ret:
                print("Failed to read frame from camera")
                break

        read_trackbars(vision)

        board, contours_per_pit = vision.scan_board(frame, return_contours=True)
        annotated = vision.annotate_frame(frame, board, contours_per_pit)
        mask_preview = whole_frame_mask(vision, frame, contours_per_pit)

        cv2.imshow(WINDOW_MAIN, annotated)
        cv2.imshow(WINDOW_MASK, mask_preview)

        key = cv2.waitKey(30) & 0xFF

        if key == 27:  # Esc
            break

        elif key == ord('p'):
            calib_frame = static_frame.copy() if static_frame is not None else frame.copy()
            vision.calibrate_pits(calib_frame)

        elif key == ord('s'):
            vision.save_calibration()
            print("Calibration saved.")

        elif key == ord('r'):
            vision.calibration = vision.load_calibration()
            vision.pit_radius = vision.calibration.get("pit_radius", vision.pit_radius)
            vision.seed_lower = np.array(vision.calibration.get(
                "seed_lower", list(vision.seed_lower)))
            vision.seed_upper = np.array(vision.calibration.get(
                "seed_upper", list(vision.seed_upper)))
            vision.min_seed_area = vision.calibration.get("min_seed_area", vision.min_seed_area)
            vision.max_seed_area = vision.calibration.get("max_seed_area", vision.max_seed_area)
            vision.min_circularity = vision.calibration.get(
                "min_circularity", vision.min_circularity)
            vision.watershed_peak_ratio = vision.calibration.get(
                "watershed_peak_ratio", vision.watershed_peak_ratio)

            # push reloaded values back onto the sliders
            cv2.setTrackbarPos("H min", WINDOW_SLIDERS, int(vision.seed_lower[0]))
            cv2.setTrackbarPos("H max", WINDOW_SLIDERS, int(vision.seed_upper[0]))
            cv2.setTrackbarPos("S min", WINDOW_SLIDERS, int(vision.seed_lower[1]))
            cv2.setTrackbarPos("S max", WINDOW_SLIDERS, int(vision.seed_upper[1]))
            cv2.setTrackbarPos("V min", WINDOW_SLIDERS, int(vision.seed_lower[2]))
            cv2.setTrackbarPos("V max", WINDOW_SLIDERS, int(vision.seed_upper[2]))
            cv2.setTrackbarPos("Pit radius", WINDOW_SLIDERS, vision.pit_radius)
            cv2.setTrackbarPos("Min area", WINDOW_SLIDERS, vision.min_seed_area)
            cv2.setTrackbarPos("Max area", WINDOW_SLIDERS, vision.max_seed_area)
            cv2.setTrackbarPos("Circularity x100", WINDOW_SLIDERS,
                                int(vision.min_circularity * 100))
            cv2.setTrackbarPos("Watershed peak x100", WINDOW_SLIDERS,
                                int(vision.watershed_peak_ratio * 100))
            print("Calibration reloaded from disk.")

    if cap is not None:
        cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()