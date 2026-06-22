
from ml.inference import SafetyDetector
from ml.zone_checker import ZoneChecker
import cv2


detector = SafetyDetector()


safe_zone = [(160, 120), (480, 120), (480, 360), (160, 360)]
checker = ZoneChecker(safe_zones=[safe_zone])

cap = cv2.VideoCapture(0)
print("Press Q to quit")

while True:
    success, frame = cap.read()
    if not success:
        break

    # Run PPE detection
    result = detector.run_ppe(frame)

    # Draw safe zones on the frame
    annotated = checker.draw_zones(result.annotated_frame)

   
    for det in result.detections:
        if det.class_name == "person":
            foot = checker.get_foot_point(det.bbox)
            in_zone = checker.is_in_safe_zone(foot)

           
            color = (0, 255, 0) if in_zone else (0, 0, 255) 
            cv2.circle(annotated, foot, 6, color, -1)

            if not in_zone:
                cv2.putText(annotated, "ZONE VIOLATION",
                           (foot[0] - 60, foot[1] - 10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

   
    fps_text = f"Inference: {result.inference_time_ms:.1f}ms"
    cv2.putText(annotated, fps_text, (10, 30),
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    cv2.imshow("Secure Vision", annotated)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()