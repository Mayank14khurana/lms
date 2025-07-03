const jwt=require('jsonwebtoken');


 const isAuthenticated =async (req,res,next)=>{
    try{
     console.log('Token middleware starts');
    const token =req.cookies.token;
     console.log('Cookies on protected route:', token);
    if(!token){
        return res.status(401).json({
            success:false,
            message:"User not authenticated"
        })
    }
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    if(!decode){
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }
    req.id =decode.userId;
    next();
    }catch(err){
        console.log(err);
    }
}
module.exports=isAuthenticated;
