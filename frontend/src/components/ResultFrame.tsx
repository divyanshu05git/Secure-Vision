import type { DetectionResponse } from "../types"
import ViolationBadge from "./ViolationBadge"

interface Props {
  result: DetectionResponse
}

export default function ResultFrame({ result }: Props) {
  return (
    <div className="flex gap-5 mt-6">

      {/* Annotated image */}
      <div className="flex-1">
        <div className="bg-white border border-[#ebebeb] rounded-xl overflow-hidden">
          <img
            src={`data:image/jpeg;base64,${result.annotated_frame}`}
            alt="Detection result"
            className="w-full block"
          />
        </div>
        <p className="text-xs text-[#999] mt-2">
          Inference time: {result.inference_time_ms}ms
        </p>
      </div>

      {/* Right panel */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">

        {/* Summary card */}
        <div className="bg-white border border-[#ebebeb] rounded-xl p-5">
          <p className="text-[11px] font-semibold text-[#999] tracking-widest uppercase mb-4">
            Summary
          </p>

          <div className="flex gap-3">
            {/* Detections count */}
            <div className="flex-1 bg-[#f9f9f9] rounded-lg p-3 text-center">
              <p className="text-2xl font-semibold text-[#111]">
                {result.detections.length}
              </p>
              <p className="text-xs text-[#999] mt-0.5">Detected</p>
            </div>

            {/* Violations count */}
            <div className={`flex-1 rounded-lg p-3 text-center
              ${result.violation_count > 0 ? "bg-red-50" : "bg-green-50"}`}
            >
              <p className={`text-2xl font-semibold
                ${result.violation_count > 0 ? "text-red-500" : "text-green-500"}`}
              >
                {result.violation_count}
              </p>
              <p className="text-xs text-[#999] mt-0.5">Violations</p>
            </div>
          </div>
        </div>

        {/* Detections list */}
        <div className="bg-white border border-[#ebebeb] rounded-xl p-5 flex-1">
          <p className="text-[11px] font-semibold text-[#999] tracking-widest uppercase mb-3">
            Detections
          </p>

          {result.detections.length === 0 ? (
            <p className="text-sm text-[#999]">Nothing detected</p>
          ) : (
            result.detections.map((det, i) => (
              <ViolationBadge key={i} detection={det} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}