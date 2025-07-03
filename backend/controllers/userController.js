const User=require('../models/userModel');
const OTP=require('../models/OTP');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const generateToken = require('../utils/token');
const { deleteMedia, uploadMedia } = require('../utils/cloudinary');
const otpGenerator=require('otp-generator');
exports.sendOTP =async (req,res)=>{
    try{
       const {email} =req.body;
       const user = await User.findOne({email});
       if(user){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
       }
       var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
       })
       console.log("OTP",otp);
       let result = await OTP.findOne({otp:otp})
       while(result){
        otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
        })
        result =await OTP.findOne({
            otp:otp
        })
       };
       const otpPayload = {email ,otp};
       const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        })
    }
    catch(err){
        console.log("Error in sending OTP", err);
        return res.status(401).json({
            success: false,
            message: "Error in sending OTP"
        })
    }
}
exports.registerUser= async(req,res)=>{
    try{
        const {name,email,password,otp}=req.body;
        if(!name || !email || !password || !otp){
            return res.status(400).json({message:'Please fill in all fields',
                success:false
            })
        }
        const userExist=await User.findOne({email});
        if(userExist){
            return res.status(401).json({
                success:false,
                message:"User already exists"
            })
        }
        const hashedPassword =await bcrypt.hash(password,10);
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp)
        if (recentOtp.length == 0) {
           return res.status(400).json({
               success: false,
               message: "otp not found "
           })
       } else if (otp !== recentOtp[0].otp) {
           return res.status(400).json({
               success: false,
               message: "otp does not match "
           })
       }
        await User.create({
            name,
            email,
            password:hashedPassword
        })

        return res.status(201).json({
            success:true,
            message:"Account Created Successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.loginUser=async (req,res)=>{
    try{
        const {email,password} =req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        const check =await bcrypt.compare(password,user.password);
        if(!check){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }
        generateToken(res,user,`Welcome back ${user.name}`);
       
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
exports.logoutUser=async (req,res)=>{
    try{
     return res.status(200).cookie("token","",{maxAge:0}).json({
        success:true,
        message:"Log out successfully"
     })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
exports.getUserProfile= async (req,res)=>{
    try{
         const userId=req.id;
         const user=await User.findById(userId).select("-password").populate({path:'enrolledCourses',populate:{path:'creator'}})
        console.log('get profile is hit');
         if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
         }
         return res.status(200).json({
            success:true,
            user
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.updateProfile =async (req,res)=>{
    try{
        const userId=req.id;
        const {name}=req.body;
        const photo =req.file;
        const user =await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        if(user.photoUrl){
          const publicId = user.photoUrl.split("/").pop().split(".")[0];
          deleteMedia(publicId);        
        }
        const cloudResponse= await uploadMedia(photo.path);
        const photoUrl=cloudResponse.secure_url;

        const updatedData={name,photoUrl};
        const updatedUser =await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");

        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            user:updatedUser
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to update the profile"
            })
    }

}
