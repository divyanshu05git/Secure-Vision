import { useState } from "react"
import UploadBox from "../components/UploadBox"
import ResultFrame from "../components/ResultFrame"
import type { DetectionResponse } from "../types"

export default function Home() {
  const [result, setResult] = useState<DetectionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

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
          Upload a workplace image to check PPE compliance
        </p>
      </div>

      <UploadBox
        onResult={(r) => { setResult(r); setError(null) }}
        onError={(e) => { setError(e); setResult(null) }}
      />

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-500">
          {error}
        </div>
      )}

      {result && <ResultFrame result={result} />}
    </div>
  )
}