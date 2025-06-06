const Stripe = require('stripe');
const Course = require('../models/CourseModel');
const Lecture =require('../models/LectureMode')
const CoursePurchase = require('../models/CoursePurchaseModel');
const User =require('../models/userModel');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        const newPurchase = new CoursePurchase({
            userId, courseId, amount: course.coursePrice, status: "pending"
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.courseTitle,
                            images: [course.courseThumbnail],
                        },
                        unit_amount: course.coursePrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/course-progress/${courseId}`,
            cancel_url: `http://localhost:5173/course-detail/${courseId}`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
        })
        if (!session.url) {
            return res
                .status(400)
                .json({ success: false, message: "Error while creating session" });
        }
        newPurchase.paymentId = session.id;
        await newPurchase.save();
        return res.status(200).json({
            success: true,
            url: session.url,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error in checking out the session"
        })
    }
}

exports.webhook =async (req,res)=>{
    let event;
    try {
      const payloadString = JSON.stringify(req.body, null, 2);
      const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
  
      const header = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
      });
  
      event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
      console.error("Webhook error:", error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }
  
    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
      console.log("check session complete is called");
  
      try {
        const session = event.data.object;
  
        const purchase = await CoursePurchase.findOne({
          paymentId: session.id,
        }).populate({ path: "courseId" });
  
        if (!purchase) {
          return res.status(404).json({ message: "Purchase not found" });
        }
  
        if (session.amount_total) {
          purchase.amount = session.amount_total / 100;
        }
        purchase.status = "completed";
  
        // Make all lectures visible by setting `isPreviewFree` to true
        if (purchase.courseId && purchase.courseId.lectures.length > 0) {
          await Lecture.updateMany(
            { _id: { $in: purchase.courseId.lectures } },
            { $set: { isPreviewFree: true } }
          );
        }
  
        await purchase.save();
  
        // Update user's enrolledCourses
        await User.findByIdAndUpdate(
          purchase.userId,
          { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
          { new: true }
        );
  
        // Update course to add user ID to enrolledStudents
        await Course.findByIdAndUpdate(
          purchase.courseId._id,
          { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
          { new: true }
        );
      } catch (error) {
        console.error("Error handling event:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    res.status(200).send();
}

exports.getCourseDetailsWithPurchaseStatus = async (req,res) =>{
  try{
     const {courseId} =req.params;
     const userId=req.id;
     const course=await Course.findById(courseId).populate({path:'creator'}).populate({path:'lectures'});
     const purchased = await CoursePurchase.find({userId,courseId}).sort({createdAt:-1}).limit(1);
     const isPurchased = purchased.length > 0 && purchased[0].status === "completed";
     console.log(purchased)
     console.log(isPurchased)
     if(!course){
      return res.status(404).json({
        success:false,
        message:"Course not found"
      });
     }
     return res.status(200).json({
      success:true,
      message:"Purchased course fetched successfully",
      course,
      purchased:  isPurchased
     })
  }catch(err){
    console.error(err);
    return res.status(500).json({
      success:false,
      message: "Internal Server Error" 
    });
  }
}

exports.getAllPurchasedCourses = async (req,res)=>{
  try{
   const purchasedCourse = await CoursePurchase.find({status:"completed"}).populate('courseId');
   if(!purchasedCourse){
    return res.status(404).json({
      success:false,
      purchasedCourse:[]
    });
   }
   return res.status(200).json({
    success:true,
    purchasedCourse
   })
  }catch(err){
    console.error(err);
    return res.status(500).json({
      success:false,
      message:"Failed to get purchased courses"
    })
  }
}