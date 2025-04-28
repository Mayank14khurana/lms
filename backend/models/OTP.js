const mongoose =require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email:{
     type:String,
     required:true   
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*1000
    }
})
async function  sendVerificationMail(email,otp) {
    try{
        const mailResponse = await mailSender(email,"Verification Mail " ,` Welcome, the otp required to complete the process is ${otp}`);
        console.log("Email", mailResponse);
    }catch(err){
        console.log("Error while sending verification mail",err);
        throw err;
    }
}
otpSchema.pre("save",async function(next){
    await sendVerificationMail(this.email,this.otp)
    next();
})
module.exports = mongoose.model('OTP',otpSchema)