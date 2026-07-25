import cv2
import numpy as np

cap = cv2.VideoCapture(0)

cv2.namedWindow("Trackbars")

def nothing(x):
    pass

# Lower
cv2.createTrackbar("LH", "Trackbars", 0, 179, nothing)
cv2.createTrackbar("LS", "Trackbars", 0, 255, nothing)
cv2.createTrackbar("LV", "Trackbars", 0, 255, nothing)

# Upper
cv2.createTrackbar("UH", "Trackbars", 179, 179, nothing)
cv2.createTrackbar("US", "Trackbars", 255, 255, nothing)
cv2.createTrackbar("UV", "Trackbars", 255, 255, nothing)

while True:

    ret, frame = cap.read()

    if not ret:
        break

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    lh = cv2.getTrackbarPos("LH", "Trackbars")
    ls = cv2.getTrackbarPos("LS", "Trackbars")
    lv = cv2.getTrackbarPos("LV", "Trackbars")

    uh = cv2.getTrackbarPos("UH", "Trackbars")
    us = cv2.getTrackbarPos("US", "Trackbars")
    uv = cv2.getTrackbarPos("UV", "Trackbars")

    lower = np.array([lh, ls, lv])
    upper = np.array([uh, us, uv])

    mask = cv2.inRange(hsv, lower, upper)

    result = cv2.bitwise_and(frame, frame, mask=mask)

    cv2.imshow("Original", frame)
    cv2.imshow("Mask", mask)
    cv2.imshow("Result", result)

    key = cv2.waitKey(1)

    if key == 27:
        break

print("\nUse these values:")
print(f"Lower = np.array([{lh}, {ls}, {lv}])")
print(f"Upper = np.array([{uh}, {us}, {uv}])")

cap.release()
cv2.destroyAllWindows()







# import cv2
# import numpy as np

# # -----------------------------
# # Mouse callback
# # -----------------------------
# def mouse_callback(event, x, y, flags, param):

#     global frame

#     if event == cv2.EVENT_LBUTTONDOWN:

#         bgr = frame[y, x]

#         hsv = cv2.cvtColor(
#             np.uint8([[bgr]]),
#             cv2.COLOR_BGR2HSV
#         )[0][0]

#         print(f"\nPixel ({x}, {y})")
#         print(f"BGR : {bgr}")
#         print(f"HSV : {hsv}")

# # -----------------------------
# # Camera
# # -----------------------------
# cap = cv2.VideoCapture(0)

# cv2.namedWindow("HSV Picker")
# cv2.setMouseCallback("HSV Picker", mouse_callback)

# while True:

#     ret, frame = cap.read()

#     if not ret:
#         break

#     cv2.putText(
#         frame,
#         "Click on a game piece",
#         (10, 30),
#         cv2.FONT_HERSHEY_SIMPLEX,
#         0.8,
#         (0, 255, 0),
#         2
#     )

#     cv2.imshow("HSV Picker", frame)

#     key = cv2.waitKey(1)

#     if key == 27:   # ESC
#         break

# cap.release()
# cv2.destroyAllWindows()