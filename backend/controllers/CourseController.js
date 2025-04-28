const Course = require('../models/CourseModel');
const { deleteMedia, uploadMedia, deleteVideo } = require('../utils/cloudinary');
const Lecture = require('../models/LectureMode');
const mongoose = require('mongoose');
exports.createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(401).json({
                success: false,
                message: "Course title and category are required"
            })
        }
        const course = await Course.create({
            courseTitle, category,
            creator: req.id
        });

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to create course"
        })
    }
}

exports.getAllCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: "No courses found"
            })
        }
        return res.status(200).json({
            success: true,
            courses,
            message: "Courses fetched successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your courses"
        })
    }
}

exports.editCourse = async (req, res) => {
    try {

        const courseId = req.params.courseId
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(400).json({
                success: false,
                message: "Course not found"
            })
        }

        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split('/').pop().split(".")[0];
                await deleteMedia(publicId)
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            updatedCourse
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to edit course"
        })
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({
                success: false,
                message: "Course not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get course"
        })
    }
}

exports.createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;
        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please provide lecture title and course id"
            })
        }

        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            success: true,
            message: "Lecture created successfully",
            lecture
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to create lecture"
        })
    }
}

exports.getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        const lectures = course.lectures
        return res.status(200).json({
            success: true,
            message: "Lectures fetched successfully",
            lectures
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get lecture"
        })
    }
}

exports.editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        const course = await Course.findById(courseId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            })
        }
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle;
        }
        if (videoInfo?.videoUrl) {
            lecture.videoUrl = videoInfo.videoUrl;
        }
        if (videoInfo?.publicId) {
            lecture.publicId = videoInfo.publicId;
        }
        if (isPreviewFree) {
            lecture.isPreviewFree = isPreviewFree;
        }
        await lecture.save();
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(200).json({
            success: true,
            message: "Lecture updated successfully",
            lecture
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to edit lecture"
        })
    }
}

exports.removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            })
        }
        if (lecture.publicId) {
            await deleteVideo(lecture.publicId);
        }
        await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } });

        return res.status(200).json({
            success: true,
            message: "Lecture removed successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete lecture"
        })
    }
}

exports.getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Lecture fetched successfully",
            lecture
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get lecture"
        })
    }
}

exports.togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const {publish} =req.query;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        course.isPublished= publish ==='true';
        await course.save();
        const statusMessage =course.isPublished ?"Published":"Unpublished"
        return res.status(200).json({
            success: true,
            message: `Course is ${statusMessage}`,
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update course status"
        })
    }
}

exports.getPublishedCourse= async (_,res)=>{
    try{
       const course= await Course.find({isPublished:true}).populate('creator');
       if(!course){
        return res.status(404).json({
            success:false,
            message:"No course found"
        })
       }
       return res.status(200).json({
        success:true,
        message:"Course found successfully",
        course
       })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to get published Courses"
        })
    }
}

exports.searchCourse = async (req,res) => {
    try{
       const {query=" ", categories=[],sortByPrice=''} =req.query;
       const searchCriteria ={
        isPublished:true,
        $or:[
            {courseTitle:{$regex:query, $options :'i'}},
            {SubTitle:{$regex:query, $options :'i'}},
            {category:{$regex:query, $options :'i'}}
        ]
       };
       if(categories.length>0){
          searchCriteria.category = {$in:categories}
       }
       const sortOptions ={}
       if(sortByPrice=='low'){
        sortOptions.coursePrice=1
       }
       else if(sortByPrice=='high'){
        sortOptions.coursePrice=-1
       }
       let courses = await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions)
       return res.status(200).json({
        success:true,
        message:"Courses found successfully",
        courses: courses || []
       });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to search course"
        })
    }
}