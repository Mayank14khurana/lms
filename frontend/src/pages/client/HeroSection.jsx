import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery,setSearchQuery] = useState('');
  const navigate =useNavigate();
  const searchHandler =(e)=>{
    e.preventDefault();
    if(searchQuery.trim()!==""){
          navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery('');
  }
  return (
    <div className='relative bg-gradient-to-r from-blue-500 to bg-indigo-600  dark:from-gray-800 to dark:to-gray-900 py-16 px-4 text-center mt-7'>
       <div className='max-w-3xl mx-auto'>
       <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses for You</h1>
       <p className='text-gray-200 dark:text-gray-400 mb-8'> Discover, Learn, and Upskill with our wide range of courses</p>
       <form  onSubmit={searchHandler}  className='flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl  mx-auto mb-6'>
        <input value={searchQuery} onChange={(e)=>(setSearchQuery(e.target.value))}  type="text" className='flex-grow border-none outline-none px-6 py-3 text-gray-900 dark:text-gray-100' />
        <button type="submit" className='bg-blue-600 dark:bg-blue-800 text-white px-6 py-3 placeholder:gray-400 dark:placeholder-gray-400 rounded-r-full hover:bg-blue-700'> Search</button> 
       </form>
       <button onClick={()=> navigate(`/course/search?query`)}   className='bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200 py-1 px-2 font-medium'>Explore Courses </button>
       </div>
    </div>
  )
}

export default HeroSection
