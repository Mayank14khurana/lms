const CourseProgress = require('../models/CourseProgressModel');
const Course = require('../models/CourseModel');


exports.getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        const courseProgress = await CourseProgress.findOne({ courseId, userId }).populate('courseId').populate('userId');
        const courseDetails = await Course.findById(courseId).populate('lectures');
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            })
        }
        if (!courseProgress) {
            return res.status(200).json({
                success: true,
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            })
        }
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).josn({
            success: false,
            message: "Error while fetching the course progress"
        })
    }
}

exports.updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({ courseId, userId })
        if (!courseProgress) {
            courseProgress = await new CourseProgress({ courseId, completed: false, userId, lectureProgress: [] });
        }
        
        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId===lectureId);
        if(lectureIndex !=-1){
            courseProgress.lectureProgress[lectureIndex].viewed =true;
        }
        else{
             courseProgress.lectureProgress.push({lectureId, viewed: true});
        }
        const lectureProgressLength =courseProgress.lectureProgress.filter((lecture)=>lecture.viewed).length;
        const course =await Course.findById(courseId);
        if(course.lectures.length ===lectureProgressLength) courseProgress.completed =true;
        await courseProgress.save();
        return res.status(200).json({ success: true, message: "Lecture progress updated" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while updating the lecture progress"
        })
    }
} 

exports.markAsCompleted = async (req,res) => {
     try{
         const {courseId} =req.params;
         const userId =req.id;
         const courseProgress =await CourseProgress.findOne({courseId,userId});
         if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course progress not found"
            })
         }
         courseProgress.lectureProgress.map((lp)=>(lp.viewed=true));
         courseProgress.completed=true;
         await courseProgress.save();
         return res.status(200).json({
            success: true,
            message: "Course progress updated successfully"
         });
     }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while marking the course as completed"
            })
     }
} 

exports.markAsInCompleted = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.id;
  
      const courseProgress = await CourseProgress.findOne({ courseId, userId });
      if (!courseProgress)
        return res.status(404).json({ message: "Course progress not found" });
  
      courseProgress.lectureProgress.map(
        (lectureProgress) => (lectureProgress.viewed = false)
      );
      courseProgress.completed = false;
      await courseProgress.save();
      return res.status(200).json({ message: "Course marked as incompleted." });
    } catch (error) {
      console.log(error);
    }
  };