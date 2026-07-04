import express from "express"
import { query } from "../db/index.js"

const router = express.Router()

export const saveViolation = async (violation) => {
  try {
    await query(
      `INSERT INTO violations (type, confidence, bbox)
       VALUES ($1, $2, $3)`,
      [
        violation.class_name,
        violation.confidence,
        JSON.stringify(violation.bbox)
      ]
    )
  } catch (err) {
    console.error("Failed to save violation:", err.message)
  }
}

router.get("/violations", async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM violations ORDER BY timestamp DESC LIMIT 100`
    )
    return res.json(result.rows)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

router.get("/violations/stats", async (req, res) => {
  try {
    const result = await query(`
      SELECT type, COUNT(*)::int as count
      FROM violations
      GROUP BY type
      ORDER BY count DESC
    `)
    const stats = {}
    result.rows.forEach(row => {
      stats[row.type] = row.count
    })
    return res.json(stats)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

router.delete("/violations", async (req, res) => {
  try {
    await query(`DELETE FROM violations`)
    return res.json({ message: "Violations cleared" })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router