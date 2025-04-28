import React from 'react'
import Course from './Course';
import { useGetPublishedCoursesQuery } from '@/features/api/courseAPI';

const Courses = () => {
    const { data, isLoading, isSuccess, error } = useGetPublishedCoursesQuery();
    if (error) return <h1>Error occured while fetching the data</h1>
    return (
        <div className='bg-gray-50 dark:bg-[#141414]'>
            <div className='max-w-7xl mx-auto p-6'>
                <h2 className='font-bold text-center text-3xl mb-10'>Our Courses</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {
                        isLoading ? Array.from({ length: 8 }).map((_, index) => (
                            <CourseSkeleton key={index} />
                        )) : data?.course.map((cours, index) => (<Course key={index} course={cours} />))
                    }
                </div>

            </div>
        </div>
    )
}

export default Courses

const CourseSkeleton = () => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <div className="w-full h-36 bg-gray-300 animate-pulse" />
            <div className="px-5 py-4 space-y-3">
                <div className="h-6 w-3/4 bg-gray-300 animate-pulse" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-gray-300 animate-pulse" />
                        <div className="h-4 w-20 bg-gray-300 animate-pulse" />
                    </div>
                    <div className="h-4 w-16 bg-gray-300 animate-pulse" />
                </div>
                <div className="h-4 w-1/4 bg-gray-300 animate-pulse" />
            </div>
        </div>
    );
};
