import express from "express"
import cors from "cors"
import morgan from "morgan"
import detectRouter from "./routes/detect.js"

const app=express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api",detectRouter)

app.listen(3000,()=>{
   console.log("backend is running on port 30000")
});
