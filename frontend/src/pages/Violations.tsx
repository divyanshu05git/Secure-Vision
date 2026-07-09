import { useEffect, useState } from "react"
import { getViolations, getViolationStats, clearViolations } from "../api/detect"
import type { Violation, ViolationStats } from "../types"

export default function Violations() {
  const [violations, setViolations] = useState<Violation[]>([])
  const [stats, setStats] = useState<ViolationStats>({})
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [v, s] = await Promise.all([getViolations(), getViolationStats()])
      setViolations(v)
      setStats(s)
    } catch {
      console.log("Backend not reachable")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-[11px] font-semibold text-[#999] tracking-widest uppercase mb-2">
            Safety Log
          </p>
          <h1 className="text-3xl font-semibold text-[#111] tracking-tight">
            Violation History
          </h1>
        </div>

        <button
          onClick={async () => { await clearViolations(); fetchData() }}
          className="px-4 py-2 bg-white text-red-500 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Stats cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {Object.entries(stats).map(([type, count]) => (
            <div key={type} className="bg-white border border-[#ebebeb] rounded-xl p-5">
              <p className="text-3xl font-semibold text-red-500 tracking-tight">
                {count}
              </p>
              <p className="text-xs text-[#999] mt-1 capitalize">
                {type.replace(/[-_]/g, " ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#ebebeb] rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-8 text-sm text-[#999]">Loading...</p>
        ) : violations.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[15px] text-[#999]">No violations recorded yet</p>
            <p className="text-sm text-[#bbb] mt-1">
              Upload an image on the Detection page to get started
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f3f3f3]">
                {["#", "Type", "Confidence", "Time"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#999] tracking-widest uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {violations.map((v) => (
                <tr key={v.id} className="border-b border-[#f9f9f9] hover:bg-[#fafafa] transition-colors">
                  <td className="px-5 py-3.5 text-sm text-[#bbb]">{v.id}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full capitalize">
                      {v.type.replace(/[-_]/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#111]">
                    {(v.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#999]">
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}