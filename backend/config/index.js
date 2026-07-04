import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,

  
  inferenceServerUrl: process.env.INFERENCE_SERVER_URL || "http://localhost:8000",
  
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/securevision",

  nodeEnv: process.env.NODE_ENV || "development",
};