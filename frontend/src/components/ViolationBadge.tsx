import type { DetectionItem } from "../types"

interface Props {
  detection: DetectionItem
}

export default function ViolationBadge({ detection }: Props) {
  const isViolation = detection.is_violation

  return (
    <div className={`flex items-center justify-between px-3 py-2.5 mb-1.5 rounded-lg bg-white border
      ${isViolation ? "border-red-200" : "border-green-200"}`}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full flex-shrink-0
          ${isViolation ? "bg-red-500" : "bg-green-500"}`}
        />
        <span className="text-[13px] font-medium text-[#111] capitalize">
          {detection.class_name.replace(/[-_]/g, " ")}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isViolation && (
          <span className="text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full tracking-wide">
            VIOLATION
          </span>
        )}
        <span className="text-xs text-[#999]">
          {(detection.confidence * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  )
}