import { useEffect, useRef, useState } from "react"
import { detectImage } from "../api/detect"
import type { DetectionResponse } from "../types"

interface Props {
  onResult: (result: DetectionResponse) => void
  onError: (error: string) => void
}

export default function CameraCapture({ onResult, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setReady(true)
        }
      })
      .catch(() => onError("Could not access camera — check browser permissions"))

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const capture = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
        type: "image/jpeg",
      })

      setLoading(true)
      try {
        const result = await detectImage(file)
        onResult(result)
      } catch {
        onError("Detection failed — is the backend running?")
      } finally {
        setLoading(false)
      }
    }, "image/jpeg", 0.92)
  }

  return (
    <div className="border-2 border-dashed rounded-xl p-6 text-center bg-white border-[#ddd]">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video max-w-2xl mx-auto">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Starting camera...
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />

      <button
        onClick={capture}
        disabled={!ready || loading}
        className={`mt-4 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
          ${loading || !ready
            ? "bg-[#eee] text-[#999] cursor-wait"
            : "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer"
          }`}
      >
        {loading ? "Running detection..." : "📸 Capture & Detect"}
      </button>
      <p className="text-xs text-[#bbb] mt-2">
        Frame is captured from your live camera feed and sent for detection
      </p>
    </div>
  )
}