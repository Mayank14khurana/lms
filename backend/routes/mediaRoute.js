const express=require('express');
const upload=require('../utils/multer')
const {uploadMedia}=require('../utils/cloudinary')

const router=express.Router();
router.post('/upload-video',upload.single('file'),async (req,res)=>{
    try{
    const result =await uploadMedia(req.file.path);
    return res.status(200).json({
        success:true,
        message:"Video uploaded successfully",
        data:result
    })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to upload video"
        })
    }
})
module.exports=router;