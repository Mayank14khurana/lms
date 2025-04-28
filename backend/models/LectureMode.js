const mongoose=require('mongoose');

const lectureSchema=new mongoose.Schema({
    lectureTitle:{
        type:String,
        required:true,
        trim:true
    },
    videoUrl:{
        type:String
    },
    publicId:{
        type:String
    },
    isPreviewFree:{
        type:Boolean
    }
},{timestamps:true});

module.exports=new mongoose.model('Lecture',lectureSchema);