import { useState, useRef } from "react"
import { detectImage } from "../api/detect"
import type { DetectionResponse } from "../types"

interface Props {
  onResult: (result: DetectionResponse) => void
  onError: (error: string) => void
}

export default function UploadBox({ onResult, onError }: Props) {
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      onError("Please upload an image file")
      return
    }

    setLoading(true)
    try {
      const result = await detectImage(file)
      onResult(result)
    } catch {
      onError("Detection failed — is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={() => !loading && inputRef.current?.click()}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-150
        ${loading ? "cursor-wait" : "cursor-pointer"}
        ${dragOver
          ? "border-violet-400 bg-violet-50"
          : "border-[#ddd] bg-white hover:border-[#bbb] hover:bg-[#fafafa]"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {loading ? (
        <div>
          <p className="text-[15px] font-medium text-violet-600">
            Running detection...
          </p>
          <p className="text-sm text-[#999] mt-1">This takes a moment</p>
        </div>
      ) : (
        <div>
          <div className="w-12 h-12 bg-[#f3f3f3] rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl">
            📷
          </div>
          <p className="text-[15px] font-medium text-[#111] mb-1">
            Upload an image
          </p>
          <p className="text-sm text-[#999]">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-[#bbb] mt-2">
            JPG, PNG, WEBP supported
          </p>
        </div>
      )}
    </div>
  )
}