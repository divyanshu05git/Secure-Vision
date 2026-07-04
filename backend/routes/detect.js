import express from "express";
import axios from "axios";
import FormData from "form-data";
import { upload } from "../middleware/upload.js";
import { saveViolation } from "./violations.js" 



const router =express.Router()

router.post('/detect',upload.single("file"),async(req,res)=>{
    if(!req.file){
        return res.status(400).json({
            message:"No file provided"
        })
    }

    try{
        //formdata that we can send to fastapi
        const formData=new FormData();

        formData.append(
            "file",
            req.file.buffer,{
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            }
            
        )

        //send to inference model
        const response=await axios.post(
            //add inference url
            "http://localhost:8000/api/v1/detect",
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 10000,
            }
        )

        const detectionData = response.data

        // Save violations to DB  ← add this block
        if (detectionData.violations?.length > 0) {
        for (const violation of detectionData.violations) {
            await saveViolation(violation)
        }
        }


        return res.json(response.data)
    }
    catch(err){
        return res.status(500).json({
            message:err.message,
        })
    }
})

export default router