from ultralytics import YOLO
import cv2 as cv
import numpy as np
from dataclasses import dataclass,field
from typing import List,Tuple
import time

@dataclass
class Detection:
    class_name:str  #"no-helmet","helmet","person"
    confidence:float #0-1
    bbox:Tuple[int,int,int,int] #pixel cordinates(x1,y1,x2,y2)
    is_violation:bool #True if safety problem


@dataclass
class InferenceResult:
    detections:List[Detection]=field(default_factory=list)
    violation:List[Detection]=field(default_factory=list)
    annotated_frame: np.ndarray = None  
    inference_time_ms: float = 0.0


PPE_VIOLATION_CLASSES={
    "no-helmet",
    "no-vest",
    "no-glasses",
    "no-boots",
}

HARNESS_VIOLATION_CLASSES={
    "no-harness",
}

class SafetyDetector:
    def __init__(self,ppe_model_path:str=None,harness_model_path:str=None):
        self.ppe_model=YOLO(ppe_model_path or "yolo11n.pt")

        self.harness_model=YOLO(harness_model_path or "yolo11n.pt")

    def run_ppe(self,frame:np.ndarray,conf_threshold:float=0.4)-> InferenceResult:
        start=time.time()
        raw_results=self.ppe_model(frame,conf=conf_threshold,verbose=False)
        elapsed_ms=(time.time()-start)*1000

        result=InferenceResult(inference_time_ms=elapsed_ms)

        yolo_result=raw_results[0]

        for box in yolo_result.boxes:
            class_idx=int(box.cls.item())
            class_name=yolo_result.names[class_idx]
            confidence=float(box.conf.item())
            
            x1,y1,x2,y2=box.xyxy[0].tolist()
            bbox=(int(x1),int(y1),int(x2),int(y2))

            is_violation=class_name.lower() in PPE_VIOLATION_CLASSES

            detection =  Detection(
                class_name=class_name,
                confidence=confidence,
                bbox=bbox,
                is_violation=is_violation,
            )


            result.detections.append(detection)
            if is_violation:
                result.violations.append(detection)

        result.annotated_frame=yolo_result.plot()
        return result


    def run_harness(self,frame:np.ndarray,conf_threshold:float=0.4)->InferenceResult:
        start=time.time()
        raw_results = self.harness_model(frame, conf=conf_threshold, verbose=False)
        elapsed_ms = (time.time() - start) * 1000

        result = InferenceResult(inference_time_ms=elapsed_ms)
        yolo_result = raw_results[0]

        for box in yolo_result.boxes:
            class_idx = int(box.cls.item())
            class_name = yolo_result.names[class_idx]
            confidence = float(box.conf.item())
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            bbox = (int(x1), int(y1), int(x2), int(y2))
            is_violation = class_name.lower() in HARNESS_VIOLATION_CLASSES

            detection = Detection(
                class_name=class_name,
                confidence=confidence,
                bbox=bbox,
                is_violation=is_violation,
            )
            result.detections.append(detection)
            if is_violation:
                result.violations.append(detection)

        result.annotated_frame = yolo_result.plot()
        return result



