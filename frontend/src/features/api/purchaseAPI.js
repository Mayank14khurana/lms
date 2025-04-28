import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
    reducerPath: "purchaseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api/v1/purchase',
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (courseId) => ({
                url: "/checkout/create-checkout-session",
                method: "POST",
                body: { courseId }
            })
        }),
        getCourseDetailsWithStatus: builder.query({
            query: (courseId) => ({
                url: `/course/${courseId}/detail-with-status`,
                method: "GET"
            })
        }),
        getPurchasedCourse: builder.query({
            query: () => ({
                url: '/',
                method: "GET"
            })
        })
    })
})
export const { useCreateCheckoutSessionMutation, useGetCourseDetailsWithStatusQuery, useGetPurchasedCourseQuery } = purchaseApi;