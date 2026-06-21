from ultralytics import YOLO
import cv2 as cv

model=YOLO("yolo11n.pt")

cap=cv.VideoCapture(0)

while True:
    success,frame=cap.read()

    if not success:
        print("Camera disabled")
        break

    results=model(frame,conf=0.4)

    annotated=results[0].plot()
    cv.imshow("Secure Vision-Test",annotated)

    if cv.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv.destroyAllWindows()    