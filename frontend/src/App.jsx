import React from 'react'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import HeroSection from './pages/client/HeroSection'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Courses from './pages/client/Courses'
import MyLearning from './pages/client/MyLearning'
import Profile from './pages/client/Profile'
import Sidebar from './pages/admin/lecture/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import Course from './pages/client/Course'
import CourseTable from './pages/admin/course/CourseTable'
import CreateCourse from './pages/admin/course/CreateCourse'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetails from './pages/client/CourseDetails'
import CourseProgress from './pages/client/CourseProgress'
import SearchPage from './pages/client/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoutes } from './components/ProtectedRoutes'
import ProtectPurchase from './components/ProtectPurchase'
import { ThemeProvider } from './components/ThemeProvider'

const appRouter =createBrowserRouter([
  {
    path:'/',
    element:<MainLayout/>,
    children:[
      {
        path:'/',
        element:
        <>
        <HeroSection/>
        <Courses/>
        </>
        
      },
      {
        path:'/login',
        element: <AuthenticatedUser> <Login/> </AuthenticatedUser> 
      },
      {
        path:'/mylearning',
        element: <ProtectedRoutes><MyLearning/> </ProtectedRoutes> 
      },
      {
        path:'/profile',
        element: <ProtectedRoutes>  <Profile/></ProtectedRoutes> 
      },
      ,{
        path:'course-details/:courseId',
        element:  <ProtectedRoutes><CourseDetails/> </ProtectedRoutes>  
      },
      {
       path: 'course-progress/:courseId',
       element: <ProtectedRoutes>  <ProtectPurchase><CourseProgress/>  </ProtectPurchase> </ProtectedRoutes> 
      },
      {
        path:'/course/search',
        element: <ProtectedRoutes> <SearchPage/> </ProtectedRoutes>  
      },
      {
        path:'/admin',
        element: <AdminRoute><Sidebar/> </AdminRoute>  ,
        children:[
          {
            path:"dashboard",
            element:<Dashboard/>
          },
          {
            path:"course",
            element:<CourseTable/>
          },
          {
            path:"course/create",
            element:<CreateCourse/>
          },
          {
            path:"course/:courseId",
            element:<EditCourse/>
          },{
            path:"course/:courseId/lecture",
            element:<CreateLecture/>
          },
          {
            path:"course/:courseId/lecture/:lectureId",
            element:<EditLecture/>
          }
        ]
      }
    ]
  }
])

const App = () => {
  return (
    <div>
     <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
      
     </main>
    
    </div>
  )
}

export default App
