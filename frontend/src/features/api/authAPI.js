import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { userLoggedIn, userLoggedOut} from '../authSlice';

const USER_API='http://localhost:4000/api/v1/user/'
export const authAPI= createApi({
    reducerPath:'authApi',
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include'
    }),
    endpoints:(builder)=>({ 
        registerUser:builder.mutation({
            query: (inputdata)=>({
                url:"register",
                method:"POST",
                body:inputdata
            })
        }),
        loginUser:builder.mutation({
            query: (inputdata)=>({
                url:"login",
                method:"POST",
                body:inputdata
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled;
                    
                    if (result?.data?.user) {
                        dispatch(userLoggedIn({ user: result?.data?.user }));
                    } else {
                        console.error("User data missing in response", result);
                    }
                } catch (err) {
                    console.error("Error in loginUser:", err);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
            url:"logout",
            method:"GET"
            }),
            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                  dispatch(userLoggedOut())
                } catch (err) {
                    console.error("Error in loginUser:", err);
                }
            }
        })
        ,
        loadUser: builder.query({
           query: ()=>({
                url:'profile',
                method:"GET"
           }),
           async onQueryStarted(arg,{queryFulfilled,dispatch}){
            try {
                const result = await queryFulfilled;
        
                if (result?.data?.user) {
                    dispatch(userLoggedIn({ user: result?.data?.user }));
                } else {
                    console.error("User data missing in response", result);
                }
            } catch (err) {
                console.error("Error in loginUser:", err);
            }
        }
        }),
        updateUser: builder.mutation({
            query: (inputdata)=>({
                url:"profile/update",
                method:"PUT",
                body:inputdata,
                credentials:"include"
           })
        })
    })
})

export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation,useLoadUserQuery,useUpdateUserMutation}=authAPI;