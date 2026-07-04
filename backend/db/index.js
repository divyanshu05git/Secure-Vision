import pg from "pg"
import dotenv from "dotenv"
dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // required for Neon
  }
})

pool.connect((err, client, release) => {
  if (err) {
    console.error("DB connection failed:", err.message)
  } else {
    console.log("PostgreSQL connected")
    release()
  }
})

export const query = (text, params) => pool.query(text, params)

export const initDB = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS violations (
      id          SERIAL PRIMARY KEY,
      timestamp   TIMESTAMPTZ DEFAULT NOW(),
      type        VARCHAR(100),
      confidence  FLOAT,
      bbox        JSONB,
      camera_id   VARCHAR(50) DEFAULT 'upload'
    )
  `)
  console.log("Tables ready")
}