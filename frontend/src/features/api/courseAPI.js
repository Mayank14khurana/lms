import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ['Refetch-Creator_Course', 'Refetch-Lectures'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://learning-mangement-e798.onrender.com/api/v1/course',
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "create",
                method: "POST",
                body: {
                    courseTitle, category
                }
            }),
            invalidatesTags: ['Refetch-Creator_Course']
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "getAll",
                method: "GET",
            }),
            providesTags: ['Refetch-Creator_Course']
        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `edit/${courseId}`,
                method: "PUT",
                body: formData
            })
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `get/${courseId}`,
                method: "GET"
            }),
            providesTags: ["Refetch-Creator_Course"]
        }),
        createLecture: builder.mutation({
            query: ({ courseId, lectureTitle }) => ({
                url: `${courseId}/create/lecture`,
                method: "POST",
                body: { lectureTitle }
            })
        }),
        getCourseLectures: builder.query({
            query: (courseId) => ({
                url: `get/${courseId}/lectures`,
                method: "GET"
            }),
            providesTags: ['Refetch-Lectures']
        }),
        editLecture: builder.mutation({
            query: ({ lectureId, lectureTitle, courseId, videoInfo, isPreviewFree }) => ({
                url: `${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree }
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Refetch-Lectures']
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET"
            })
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: "PUT"
            })
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: "/publishedCourses",
                method: "GET"
            })
        }),
        searchCourse :builder.query({
            query:({searchQuery,categories,sortByPrice})=>{
             let queryString =`/search?query=${encodeURIComponent(searchQuery)}`
             if(categories && categories.length>0){
                const categoriesString =categories.map(encodeURIComponent).join(".")
                queryString+=`&categories=${categoriesString}`
             }
             if(sortByPrice){
                queryString+= `&sortByPrice=${ encodeURIComponent(sortByPrice)}`
             }
             return {url:queryString,method:"GET"};
            }  
        })
    })
})

export const { useCreateCourseMutation, useGetCreatorCourseQuery, useEditCourseMutation, useGetCourseByIdQuery, useCreateLectureMutation, useGetCourseLecturesQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery, usePublishCourseMutation, useGetPublishedCoursesQuery,useSearchCourseQuery } = courseApi;
