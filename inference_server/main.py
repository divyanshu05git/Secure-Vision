import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ml.inference import SafetyDetector
from ml.zone_checker import ZoneChecker
import numpy as np
import cv2
import base64
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "ml", "models", "ppe_best_v2.pt"
)

print(f"Loading model from: {MODEL_PATH}")
detector = SafetyDetector(ppe_model_path=MODEL_PATH)

DEFAULT_ZONE = [(160, 120), (480, 120), (480, 360), (160, 360)]
zone_checker = ZoneChecker(safe_zones=[DEFAULT_ZONE])
print("Inference server ready!")


class DetectionItem(BaseModel):
    class_name: str
    confidence: float
    bbox: List[int]
    is_violation: bool

class DetectionResponse(BaseModel):
    detections: List[DetectionItem]
    violations: List[DetectionItem]
    violation_count: int
    inference_time_ms: float
    annotated_frame: Optional[str] = None


@app.get("/")
def root():
    return {"status": "Inference server running"}


@app.post("/api/v1/detect", response_model=DetectionResponse)
async def detect(file: UploadFile = File(...), confidence: float = 0.4):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"Expected image, got {file.content_type}")

    contents = await file.read()
    np_array = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Could not decode image")
    
    # 0.15->confidence
    result = detector.run_ppe(frame, conf_threshold=0.15) 

    print("Model classes:", detector.ppe_model.names)
    print("Detections:", [(d.class_name, round(d.confidence, 2)) for d in result.detections])

    zone_violations = []
    for det in result.detections:
        if det.class_name == "person":
            foot = zone_checker.get_foot_point(det.bbox)
            if not zone_checker.is_in_safe_zone(foot):
                zone_violations.append(det)

    # annotated = zone_checker.draw_zones(result.annotated_frame)
    annotated =result.annotated_frame
    _, buffer = cv2.imencode(".jpg", annotated)
    frame_b64 = base64.b64encode(buffer).decode("utf-8")

    all_violations = result.violation + zone_violations

    detection_items = [
        DetectionItem(
            class_name=d.class_name,
            confidence=round(d.confidence, 3),
            bbox=list(d.bbox),
            is_violation=d.is_violation
        )
        for d in result.detections
    ]

    violation_items = [
        DetectionItem(
            class_name=d.class_name,
            confidence=round(d.confidence, 3),
            bbox=list(d.bbox),
            is_violation=True
        )
        for d in all_violations
    ]

    

    return DetectionResponse(
        detections=detection_items,
        violations=violation_items,
        violation_count=len(violation_items),
        inference_time_ms=round(result.inference_time_ms, 2),
        annotated_frame=frame_b64
    )


