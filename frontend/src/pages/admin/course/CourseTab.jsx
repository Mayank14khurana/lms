import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import React, { useEffect, useState } from 'react'
import {
  Select, SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseAPI';
import { toast } from 'sonner';
const CourseTab = () => {
  const params = useParams();
  const courseId = params.courseId;
  const isPublished = false;
  const navigate = useNavigate();
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: '',
    courseThumbnail: "",
  })
  const [prevThumbnail, setPrevThumbnail] = useState('');

  const { data: getData, isLoading: getLoading ,refetch} = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });
  const course = getData?.course;
  useEffect(() => {
    if (course) {
      setInput({
        courseTitle: course?.courseTitle,
        subTitle: course?.subTitle,
        description: course?.description,
        category: course?.category,
        courseLevel: course?.courseLevel,
        coursePrice: course?.coursePrice,
        courseThumbnail: "",
      })
    }
  }, [course]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value })
  }
  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  }
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  }
  const selectThumbnail = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPrevThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  }

  const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
  const updateCourse = async () => {
    const formData = new FormData();
    const formattedCourseLevel = input.courseLevel.charAt(0).toUpperCase() + input.courseLevel.slice(1).toLowerCase();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", formattedCourseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    console.log(formData)
    await editCourse({ formData, courseId });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated")
    }
    if (error) {
      toast.error(error.data.message || "Error in updating course")
    }
  }, [isSuccess, error]);
  
  const [publish] =usePublishCourseMutation(); 
  const publishHandler = async (action) => {
      try{
        const response =await publish({courseId,query:action});
        refetch();
        if(response.data) toast.success(response.data.message);
      }catch(err){
         toast.error("Failed to change the status of course");
      }
  }
  return (
    <div>
      <Card>
        <CardHeader className='flex  justify-between flex-row'>
          <div>
            <CardTitle>Basic course information</CardTitle>
            <CardDescription>Make changes to your course here.Click save when you are done</CardDescription>
          </div>
          <div className='space-x-2'>
            <Button variant='outline' disabled={getData?.course?.lectures?.length===0}  onClick={() => publishHandler(getData?.course?.isPublished ? "false" : "true")} >{ getData?.course?.isPublished ? "Unpublish" : "Publish"} </Button>
            <Button>Remove Course</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4 mt-5 '>
            <div>
              <Label>Course Title</Label>
              <Input type='text' placeholder='Full Stack Developer' name='courseTitle' onChange={changeHandler} value={input.courseTitle} />
            </div>
            <div>
              <Label>Sub Title</Label>
              <Input type='text' placeholder='Become a Full Stack Developer' name='subTitle' onChange={changeHandler} value={input.subTitle} />
            </div>
            <div>
              <Label>Description</Label>
              <RichTextEditor input={input} setInput={setInput} />
            </div>
            <div className='flex items-center gap-5'>
              <div>
                <Label>Category</Label>
                <Select onValueChange={selectCategory} >
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
              <div>
                <Label>Course Level</Label>
                <Select onValueChange={selectCourseLevel}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select course level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">
                        Advanced
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price in (INR)</Label>
                <Input type="number" placeholder="0" name='coursePrice' value={input.coursePrice} className='w-fit' onChange={changeHandler} />
              </div>
            </div>
            <div>
              <Label>Course course Thumbnail</Label>
              <Input type='file' accept='image/*' className='w-fit' onChange={selectThumbnail} />
              {
                prevThumbnail && <img src={prevThumbnail} alt="prevThumbnail" className="w-64 my-2" />
              }
            </div>
            <div className='space-x-4'>
              <Button variant='outline' onClick={() => { navigate('/admin/course') }}>Cancel</Button>
              <Button variant='' onClick={updateCourse} >Save</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CourseTab
