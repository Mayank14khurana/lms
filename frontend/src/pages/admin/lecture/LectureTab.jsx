import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Switch } from '@/components/ui/switch'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseAPI'

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;
  
  const {data:getData}=useGetLectureByIdQuery(lectureId);
  const lecture=getData?.lecture;
  
  useEffect(()=>{
     if(lecture){
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture?.isPreviewFree);
      setUploadVideoInfo(lecture?.videoInfo);
      console.log(uploadVideInfo,'useeffect')
     }
  },[lecture]);

  const [EditLecture,{data,isLoading,isSuccess,error}] =useEditLectureMutation();
  const editHandler= async ()=>{
    await EditLecture({lectureTitle, videoInfo: uploadVideInfo,courseId,lectureId, isPreviewFree: isFree})
  }
  useEffect(()=>{
     if(isSuccess){
      toast.success(data.message||"lecture updated successfully")
     }
     if(error){
      toast.error(error.data.message);
     }
  },[isSuccess,error])

  const fileChangeHandler=async (e)=>{
     const file=e.target.files[0];
     if(file){
      const formData=new FormData();
      formData.append('file',file);
       setMediaProgress(true);
       try{
        const res= await axios.post(`https://learning-mangement-e798.onrender.com/api/v1/media/upload-video`,formData,{
          onUploadProgress:({loaded,total})=>{
            setUploadProgress(Math.round((loaded*100)/total))
          }
        });
        if(res.data.success){
          console.log(res);
          setUploadVideoInfo({videoUrl:res.data.data.url,publicId:res.data.data.public_id})
          setBtnDisable(false);
          toast.success(res.data.message);
        }
       }catch(err){
         console.log(err);
         toast.error("Video upload failed");
       }
       finally{
        setMediaProgress(false)
       }
     }
     console.log(uploadVideInfo)
  }
   const [removeLecture,{ data:deleteData,isLoading:deleteLoading , error:deleteError,isSuccess:deleteSuccess}]=useRemoveLectureMutation();
   const removeHandler=async ()=>{
        await removeLecture({lectureId,courseId});
   }
   useEffect(()=>{
    if(deleteSuccess){
     toast.success(deleteData.message||"lecture deleted successfully")
    }
    if(deleteError){
     toast.error(error.deleteData.message);
    }
 },[deleteSuccess,deleteError])
   
  return (
    <div >
      <Card >
        <CardHeader>
            <div>
            <CardTitle>Edit lecture</CardTitle>
            <CardDescription> Make changes and click save when done</CardDescription>
            </div>
            <div className='flex items-center gap-2'>
                <Button variant='destructive' onClick={removeHandler}>Remove lecture</Button>
            </div>
        </CardHeader>
        <CardContent>
            <div>
                <Label>Title</Label>
                <Input type='text' placeholder='Introduction to Docker' value={lectureTitle} />
            </div>
            <div className='my-5'>
                <Label>Video <span className='text-red-500'>*</span></Label>
                <Input type='file' accept='video/*' placeholder='Introduction to Docker' className='w-fit' onChange={fileChangeHandler} />
            </div>
            <div className='flex  items-center space-x-2 my-5'>
             <Switch id='airplane-mode' checked={isFree} onCheckedChange={(val)=> setIsFree(val)}  />
             <Label htmlFor='airplane-mode'> Is this video free </Label>
            </div>
            {
              mediaProgress && (
                <div>
                  <Progress value={uploadProgress} />
                  <p>{uploadProgress}% uploaded</p>
                </div>
              )
            }
            <div className='mt-4'>
             <Button onClick={editHandler}  disabled={btnDisable}>Update lecture</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LectureTab
