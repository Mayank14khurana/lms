const cloudinary =require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret:process.env.CLOUD_SECRET
})

exports.uploadMedia =async (file)=>{
         try{
          const cloudResponse =await cloudinary.uploader.upload(file,{
            resource_type:"auto"
          })
          return cloudResponse;
         }catch(err){
            console.log(err)
         }
}

exports.deleteMedia=async(publicId)=>{
          try{
            await cloudinary.uploader.destroy(publicId);
          }catch(err){
            console.log(err);
          }
}

exports.deleteVideo=async(publicId)=>{
    try{
      await cloudinary.uploader.destroy(publicId,{
        resource_type:"video"
      });
    }catch(err){
      console.log(err);
    }
}

