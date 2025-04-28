const express=require('express');
const isAuthenticated =require('../middleware/isAuthenticated');
const {registerUser,loginUser, getUserProfile, logoutUser, updateProfile, sendOTP} =require('../controllers/userController');
const upload = require('../utils/multer');
const router=express.Router();
router.post('/sendotp',sendOTP);
router.post('/register',registerUser);
router.post('/login',loginUser)
router.get('/profile',isAuthenticated,getUserProfile);
router.get('/logout',logoutUser);
router.put('/profile/update',isAuthenticated,upload.single("photo"),updateProfile);
module.exports=router;