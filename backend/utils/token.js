const jwt=require('jsonwebtoken')
const generateToken =(res,user ,message)=>{
       const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
       return res.status(200).cookie('token',token,{
               httpOnly:true,
               sameSite:'strict',
               maxAge:24*60*60*1000
       }).json({
        success:true,
        user,
        message
       })
}
module.exports=generateToken;