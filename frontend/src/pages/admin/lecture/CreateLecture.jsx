import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateLectureMutation, useGetCourseLecturesQuery } from '@/features/api/courseAPI'
import { toast } from 'sonner'
import Lecture from './Lecture'
const CreateLecture = () => {
  const [lectureTitle,setLectureTitle]=useState('');

  const navigate=useNavigate();
  const params=useParams();
  const courseId=params.courseId;

  const [CreateLecture,{data,isLoading,isSuccess,error}]=useCreateLectureMutation();
  const {data:getData,isLoading:getIsLoading,isSuccess:getIsSuccess,error:getError,refetch}=useGetCourseLecturesQuery(courseId);

  const handleCreateLecture=async()=>{
    await CreateLecture({lectureTitle,courseId});
  }

  useEffect(()=>{
    if(isSuccess){
      refetch();
      setLectureTitle('');
       toast.success(data.message||"Lecture created Successfully");
    }
    if(error){
      toast.error(error.data.message||"Error creating lecture");
    }
  },[isSuccess,error])
  return (
    <div className='flex-1 mx-10'>
      <div className='mb-4'>
        <h1 className='font-bold text-xl '>Add some basic details for your lecture</h1>
      </div>
      <div className='space-y-4'>
        <div> 
          <Label>Title</Label>
          <Input type='text' name='lectureTitle' placeholder='Lecture title' value={lectureTitle} onChange={(e)=>{setLectureTitle(e.target.value)} }    /> 
        </div>
        
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={()=>navigate(`/admin/course/${courseId}`)}>Back to course</Button>
          <Button disabled={isLoading} onClick={handleCreateLecture} >
            {
             isLoading? <><Loader2 className='mr-2 h-4 w-4 animate-spin'>Please Wait</Loader2></> :"Create lecture"
            }
          </Button>
        </div>
       
        <div className='mt-10'>
            {
              getIsLoading? <p>Loading Lectures...</p>: getError? <p>Failed to load lectures</p>:getData?.lectures?.length===0?<p>No lectures available</p> :  getData?.lectures.map((lectures,index)=>(
                <Lecture key={lectures._id} lecture={lectures} index={index} courseId={courseId} />
              ))   
            }
        </div>
      </div>
    </div>
  )
}

export default CreateLecture
