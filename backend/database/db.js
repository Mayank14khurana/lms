const mongoose=require('mongoose')

const dbConnect = async ()=>{
    try{
       mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Database Connected Successfully")
         }) 
    }catch(err){
        console.log(err);
        process.exit(1);
    }
} 
 module.exports=dbConnect;