import { useState } from "react"
import UploadBox from "../components/UploadBox"
import CameraCapture from "../components/CameraCapture"
import ResultFrame from "../components/ResultFrame"
import type { DetectionResponse } from "../types"

export default function Home2() {
  const [result, setResult] = useState<DetectionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"upload" | "camera">("camera")

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-[#999] tracking-widest uppercase mb-2">
          PPE Compliance
        </p>
        <h1 className="text-3xl font-semibold text-[#111] tracking-tight mb-2">
          Safety Detection
        </h1>
        <p className="text-sm text-[#888]">
          Capture from your camera or upload a workplace image to check PPE compliance
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("camera")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${mode === "camera"
              ? "bg-violet-600 text-white"
              : "bg-[#f3f3f3] text-[#555] hover:bg-[#eaeaea]"
            }`}
        >
          📷 Camera
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${mode === "upload"
              ? "bg-violet-600 text-white"
              : "bg-[#f3f3f3] text-[#555] hover:bg-[#eaeaea]"
            }`}
        >
          ⬆️ Upload
        </button>
      </div>

      {mode === "camera" ? (
        <CameraCapture
          onResult={(r) => { setResult(r); setError(null) }}
          onError={(e) => { setError(e); setResult(null) }}
        />
      ) : (
        <UploadBox
          onResult={(r) => { setResult(r); setError(null) }}
          onError={(e) => { setError(e); setResult(null) }}
        />
      )}

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-500">
          {error}
        </div>
      )}

      {result && <ResultFrame result={result} />}
    </div>
  )
}