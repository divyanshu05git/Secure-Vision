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
            "url",
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 10000,
            }
        )

        return res.json(response.data)
    }
    catch(err){
        return res.status(500).json({
            message:err.message,
        })
    }
})

export default router