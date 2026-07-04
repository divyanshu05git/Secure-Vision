// src/types/index.ts
// TypeScript interfaces that describe the shape of data
// coming from the Express/FastAPI backend.
// Every component imports from here instead of
// defining their own types — single source of truth.

export interface DetectionItem {
  class_name: string
  confidence: number
  bbox: number[]
  is_violation: boolean
}

export interface DetectionResponse {
  detections: DetectionItem[]
  violations: DetectionItem[]
  violation_count: number
  inference_time_ms: number
  annotated_frame: string
}

export interface Violation {
  id: number
  timestamp: string
  type: string
  confidence: number
  bbox: number[]
}

export interface ViolationStats {
  [key: string]: number
}