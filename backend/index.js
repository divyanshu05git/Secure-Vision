import express from "express"
import cors from "cors"
import morgan from "morgan"
import detectRouter from "./routes/detect.js"
import violationsRouter from "./routes/violations.js"
import { initDB } from "./db/index.js"

const app=express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api",detectRouter)
app.use("/api",violationsRouter);


initDB().then(() => {
  app.listen(3000, () => {
    console.log("Backend running on 3000")
  })
}).catch((err) => {
  console.error("Failed to init DB:", err.message)
})