const express=require('express');
const dbConnect =require('./database/db');
require('dotenv').config();
const userRoute=require('./routes/userRoute');
const courseRoute=require('./routes/course.route');
const mediaRoute=require('./routes/mediaRoute');
const purchaseRoute=require('./routes/coursePurchase.route');
const progressRoute=require('./routes/courseProgress.route');
const cookieParesr=require('cookie-parser')
const cors=require('cors');


const app=express();
dbConnect();

app.use(express.json());
app.use(cookieParesr())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use('/api/v1/user',userRoute);
app.use('/api/v1/course',courseRoute);
app.use('/api/v1/media',mediaRoute);
app.use('/api/v1/purchase',purchaseRoute);
app.use('/api/v1/progress',progressRoute);
app.get('/home',(_,res)=>{
    return res.status(200).json({
        success:true,
        message:"Hello"
    })
})


app.listen(process.env.PORT,()=>{
    console.log("Server started successfully")
})