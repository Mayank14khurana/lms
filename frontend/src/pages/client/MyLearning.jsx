import React from 'react'
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authAPI';

const MyLearning = () => {
  const {data,isLoading} =useLoadUserQuery();
  const mylearningCourses = data?.user?.enrolledCourses || [];
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
      <h1 className='font-bold text-2xl '>My Learning</h1>
       <div className='my-5'>
        {
        isLoading?(<Skeleton/>) :(
          mylearningCourses.length==0 ? <p>You haven't enrolled in any course</p>:(
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {
              mylearningCourses?.map((course,idx) =>(
                <Course key={idx} course={course} />
              )
              )
            }
            </div>
            
           
          )
        )
      }
       </div>
       
    </div>
  )
}

export default MyLearning

const Skeleton=()=>{
  return(
    <div className='grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4'>
    {[...Array(3)].map((_,index)=>(
      <div key={index} className='bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse'>
             
      </div> 
    ))

    }
  </div>
  )
  
}
 