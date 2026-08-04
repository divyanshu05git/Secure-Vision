

import os
from ultralytics import YOLO

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

PPE_MODEL_PATH = os.path.join(MODELS_DIR, "ppe_best_v2.pt")
HARNESS_MODEL_PATH = os.path.join(MODELS_DIR, "harness_best.pt")

# Edit these to point at your unzipped Roboflow dataset exports
PPE_DATA_YAML = os.path.join(BASE_DIR, "datasets", "ppe", "data.yaml")
HARNESS_DATA_YAML = os.path.join(BASE_DIR, "datasets", "harness", "data.yaml")


def validate(model_path: str, data_yaml: str, name: str):
    if not os.path.exists(data_yaml):
        print(f"[skip] {name}: dataset yaml not found at {data_yaml}")
        print("       Update the path in ml/validate.py to your unzipped dataset export.")
        return

    print(f"\n=== Validating {name} ({model_path}) ===")
    model = YOLO(model_path)
    metrics = model.val(data=data_yaml, name=name)

    print(f"\n{name} results:")
    print(f"  Precision (mean): {metrics.box.mp:.4f}")
    print(f"  Recall (mean):    {metrics.box.mr:.4f}")
    print(f"  mAP@0.5:          {metrics.box.map50:.4f}")
    print(f"  mAP@0.5:0.95:     {metrics.box.map:.4f}")
    print(f"  Plots saved to:   {metrics.save_dir}")


if __name__ == "__main__":
    validate(PPE_MODEL_PATH, PPE_DATA_YAML, "ppe_validation")
    validate(HARNESS_MODEL_PATH, HARNESS_DATA_YAML, "harness_validation")