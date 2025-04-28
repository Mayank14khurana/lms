import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {  CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge';
import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/progressAPI';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
const CourseProgress = () => {
  const params=useParams();
  const courseId =params.courseId;
  const {data,isSuccess,isLoading ,error,refetch} =useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] =useUpdateLectureProgressMutation();
  const [completeCourse ,{data:completeData,isSuccess:completeSuccess}] =useCompleteCourseMutation();
  const [inCompleteCourse ,{data:incompleteData, isSuccess: incompleteSuccess}] =useIncompleteCourseMutation();
  const [currentLecture,setCurrentLecture] =useState(null);
  useEffect(()=>{
    if(completeSuccess){
      refetch();
      toast.success(completeData.message);
    }
    if(incompleteSuccess){
      refetch();
      toast.success(incompleteData.message);
    }
  },[completeSuccess,incompleteSuccess]);
  if(isLoading) return <p>Loading...</p>
  if(error ||!data) return <p>Failed to load progress</p>
  console.log(data);
  const {courseDetails, progress, completed} =data.data;
  const {courseTitle} =courseDetails;
  const initialLecture =currentLecture || courseDetails.lectures && courseDetails.lectures[0] || null;
  
  const isLectureCompleted = (lectureId) => {
     return progress.some((prog)=>prog.lectureId===lectureId && prog.viewed);
  }
  const handleUpdateLectureProgress= async (lectureId)=>{
    await updateLectureProgress({courseId,lectureId});
    refetch();
}
  const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
        handleUpdateLectureProgress(lecture._id);
  }

  const handleCompleteCourse = async () =>{
        await completeCourse(courseId);
  } 

  const handleInCompleteCourse = async () =>{
        await inCompleteCourse(courseId);
  } 
  
  

  return (
    <div className='max-w-7xl mx-auto p-4 '>
      <div className='flex justify-between mb-4'>
         <h1 className='text-2xl font-bold'>{courseTitle}</h1>
          <Button onClick={completed? handleInCompleteCourse:handleCompleteCourse} variant={completed ?'outline' :'default'} >{completed ?  <div className='flex items-center gap-2'><CheckCircle/> <span>Completed</span>  </div> :"Mark as completed" }</Button>
      </div>
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
        <div>
             <video src={currentLecture?.videoUrl || initialLecture?.videoUrl} controls className='w-full h-auto md:rounded-lg' onPlay={()=>handleUpdateLectureProgress(currentLecture?._id || initialLecture?._id)} />
        </div>
            <div className='mt-2'>
                <h3 className='font-medium text-lg'> {`Lecture ${courseDetails.lectures.findIndex(
  (lec) => lec?._id === (currentLecture?._id || initialLecture?._id)
) + 1} :${currentLecture?.lectureTitle || initialLecture?.lectureTitle} ` } </h3>
            </div>
        </div>
        <div className='flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0 '>
           <h2 className='font-semibold text-xl mb-4'>Course lecture</h2>
           <div className='flex-1 overflow-y-auto'>
            {
              courseDetails?.lectures.map((lecture)=>(
                     <Card key={lecture?._id} className={`mb-3 hover:cursor-pointer transition transform ${lecture?._id===currentLecture?._id ? 'bg-gray-200':'dark:bg-gray-800'}  ` }onClick={()=> handleSelectLecture(lecture)} >
                       <CardContent className='flex items-center justify-between p-4' >
                        <div className='flex items-center'>
                               {
                                isLectureCompleted(lecture?._id) ? <CheckCircle2 size={24} className='text-green-500 mr-2' /> : <CirclePlay size={24} className='text-gray-500 mr-2' />
                               } 
                               <div>
                                <CardTitle className='text-lg font-medium'>{lecture?.lectureTitle}</CardTitle>
                               </div>
                        </div>
                        {
                          isLectureCompleted(lecture._id ) &&(
                                 <Badge  className='bg-green-200 text-green-600' variant={'outline'}>Completed</Badge>
                          ) 
                        }
                        
                       </CardContent>
                     </Card>
              ))
            }
           </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress
