import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const progressApi = createApi({
    reducerPath:'progressApi',
    baseQuery:fetchBaseQuery({
        baseUrl:'https://learning-mangement-e798.onrender.com/api/v1/progress',
        credentials:'include'
    }),
    endpoints:(builder)=>({
         getCourseProgress :builder.query({
            query:((courseId)=>({
                url:`/${courseId}`,
                method:'GET',
            }))
         }),
         updateLectureProgress :builder.mutation({
            query:({courseId,lectureId})=>({
                url:`/${courseId}/lecture/${lectureId}/view`,
                method:'POST',
            })
         }),
         completeCourse :builder.mutation({
          query:(courseId)=>({
               url:`/${courseId}/complete`,
               method:"POST"
          })
        }),
        incompleteCourse :builder.mutation({
            query:(courseId)=>({
                 url:`/${courseId}/incomplete`,
                 method:"POST"
            })
          })
    })
});
export const {useGetCourseProgressQuery,useCompleteCourseMutation,useIncompleteCourseMutation,useUpdateLectureProgressMutation}=progressApi;
