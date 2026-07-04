import axios from "axios"
import type { DetectionResponse, Violation, ViolationStats } from "../types"

const BASE_URL = "http://localhost:3000"

export const detectImage = async (file: File): Promise<DetectionResponse> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await axios.post<DetectionResponse>(
    `${BASE_URL}/api/detect`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
  return response.data
}

export const getViolations = async (): Promise<Violation[]> => {
  const response = await axios.get<Violation[]>(`${BASE_URL}/api/violations`)
  return response.data
}

export const getViolationStats = async (): Promise<ViolationStats> => {
  const response = await axios.get<ViolationStats>(`${BASE_URL}/api/violations/stats`)
  return response.data
}

export const clearViolations = async (): Promise<void> => {
  await axios.delete(`${BASE_URL}/api/violations`)
}