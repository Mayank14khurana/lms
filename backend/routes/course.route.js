const express =require('express');
const { createCourse, getAllCreatorCourses, editCourse, getCourseById, createLecture, getCourseLecture, editLecture, removeLecture, getLectureById, togglePublishCourse, getPublishedCourse, searchCourse } = require('../controllers/CourseController');
const isAuthenticated = require('../middleware/isAuthenticated');
const upload=require('../utils/multer')
const router =express.Router();

router.post('/create',isAuthenticated,createCourse);
router.get('/getAll',isAuthenticated,getAllCreatorCourses);
router.put('/edit/:courseId',isAuthenticated, upload.single('courseThumbnail'),editCourse);
router.get('/get/:courseId',isAuthenticated,getCourseById);
router.post('/:courseId/create/lecture',isAuthenticated,createLecture);
router.get('/get/:courseId/lectures',isAuthenticated,getCourseLecture);
router.post('/:courseId/lecture/:lectureId',isAuthenticated,editLecture);
router.delete('/lecture/:lectureId',isAuthenticated,removeLecture);
router.get('/lecture/:lectureId',isAuthenticated,getLectureById);
router.put('/:courseId',isAuthenticated,togglePublishCourse);
router.get('/publishedCourses',getPublishedCourse);
router.get('/search',isAuthenticated,searchCourse);
module.exports=router;