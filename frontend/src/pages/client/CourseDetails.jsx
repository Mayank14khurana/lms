import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@radix-ui/react-select'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import React from 'react'
import PurchaseCourseButton from './PurchaseCourseButton'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetCourseDetailsWithStatusQuery } from '@/features/api/purchaseAPI'
import ReactPlayer from 'react-player'

const CourseDetails = () => {
    const params = useParams();
    const courseId = params.courseId;
    const navigate =useNavigate();
    const { data, error, isLoading, isSuccess } = useGetCourseDetailsWithStatusQuery(courseId);
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching course details.</p>;
    if (!data) return <p>No course data available.</p>;
    const { course, purchased } = data;
    const continueCourseHandler = ()=>{
        if(purchased){
           navigate(`/course-progress/${courseId}`);
        }
    }
    console.log(data)
    return (
        <div className=' space-y-5 '>
            <div className='bg-[#2D2F31] text-white'>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                    <h1 className='font-bold text-2xl md:text-3xl '>{course?.courseTitle}</h1>
                    <p className='text-base md:text-lg '>{course?.subTitle}</p>
                    <p>Created By{" "} <span className='text-[#C0C4FC] underline italic'>{course?.creator.name}</span> </p>
                    <div className='flex items-center gap-2 text-sm'>
                        <BadgeInfo size={16} />
                        <p>Last Updated {course?.updatedAt?.split('T')[0]}</p>
                    </div>
                    <p>Students enrolled :{course?.enrolledStudents.length}</p>
                </div>
            </div>
            <div className='max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10'>
                <div className='w-full lg:w-1/2 space-y-5 '>
                    <h1 className='font-bold text-xl md:text-2xl'>Description</h1>
                    <p className='text-sm' dangerouslySetInnerHTML={{ __html: course?.description }}></p>
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>4 lectures</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            {course.lectures.map((lecture, idx) => (
                                <div key={idx} className='flex gap-3'>
                                    <span>
                                        {
                                            true ? <PlayCircle size={16} className='mt-1' /> : <Lock size={14} />
                                        }
                                    </span>
                                    <p>{lecture?.lectureTitle}</p>
                                </div>
                            ))
                            }
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full lg:w-1/3'>
                    <Card>
                        <CardContent className='p-4 flex flex-col'>
                            <div className='w-full aspect-video mb4'>
                                <ReactPlayer width="100%" height="100%" url={course?.lectures[0]?.videoUrl} controls={true} />
                            </div>
                            <h1>Lecture title</h1>
                            <Separator className='my-2' />
                            <h1 className='text-lg md:text-xl font-semibold'>Course price</h1>
                        </CardContent>
                        <CardFooter className='flex justify-center p-4'>
                            {
                                purchased ? <Button className='full'onClick ={continueCourseHandler} >Continue Learning</Button> : <PurchaseCourseButton courseId={courseId} />
                            }
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CourseDetails
