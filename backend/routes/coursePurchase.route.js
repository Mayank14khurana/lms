const express=require('express');
const router=express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const { createCheckoutSession, webhook, getCourseDetailsWithPurchaseStatus, getAllPurchasedCourses } = require('../controllers/CoursePurchaseController');
router.post('/checkout/create-checkout-session',isAuthenticated,createCheckoutSession);
router.route('/webhook').post(express.raw({type:'application/json'}),webhook);
router.get('/course/:courseId/detail-with-status', isAuthenticated,getCourseDetailsWithPurchaseStatus);
router.get('/', isAuthenticated,getAllPurchasedCourses);
module.exports=router;