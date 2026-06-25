import express from "express";
import axios from "axios";
import FormData from "form-data";
import { upload } from "../middleware/upload.js";

const router =express.Router()

router.post('/detect',upload.single("file"),async(req,res)=>{
    if(!req.file){
        return res.status(400).json({
            message:"No file provided"
        })
    }
})