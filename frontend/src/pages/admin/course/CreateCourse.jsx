import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {   Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseAPI'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateCourse = () => {

  const [courseTitle,setCourseTitle] =useState('');
  const [category,setCategory] =useState('');
  const [createCourse,{data,error,isLoading,isSuccess}]=useCreateCourseMutation();
  const navigate =useNavigate();

  const createCourseHandler= async ()=>{
         await createCourse({courseTitle,category});
  }
  const getSelectedCategory=(value)=>{
    setCategory(value);
  }
  useEffect(()=>{
     if(isSuccess){
      toast.success(data?.message||"Course created successfully");
      navigate('/admin/course');
     }
  },[isSuccess,error]) 

  return (
    <div className='flex-1 mx-10'>
      <div className='mb-4'>
        <h1 className='font-bold text-xl '>Add some basic details for your course</h1>
      </div>
      <div className='space-y-4'>
        <div> 
          <Label>Title</Label>
          <Input type='text' name='courseTitle' placeholder='Course name' value={courseTitle} onChange={(e)=>{setCourseTitle(e.target.value)} }    /> 
        </div>
        <div> 
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Next JS">Next JS</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Fullstack Development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="MERN Stack Development">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="MongoDB">MongoDB</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={()=>navigate('/admin/course')}>Back</Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {
             isLoading? <><Loader2 className='mr-2 h-4 w-4 animate-spin'>Please Wait</Loader2></> :"Create"
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateCourse
