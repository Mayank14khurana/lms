import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn, userLoggedOut } from '../authSlice';
import { skipToken } from '@reduxjs/toolkit/query';

const USER_API = 'https://learning-mangement-e798.onrender.com/api/v1/user/';

export const authAPI = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputdata) => ({
        url: 'register',
        method: 'POST',
        body: inputdata,
      }),
    }),

    loginUser: builder.mutation({
      query: (inputdata) => ({
        url: 'login',
        method: 'POST',
        body: inputdata,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.user) {
            dispatch(userLoggedIn({ user: result.data.user }));
          }
        } catch (err) {
          console.error('Error in loginUser:', err);
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: 'logout',
        method: 'GET',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (err) {
          console.error('Error in logoutUser:', err);
        }
      },
    }),

    loadUser: builder.query({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          console.log('profile from frontend');
          const result = await queryFulfilled;
          if (result?.data?.user) {
            dispatch(userLoggedIn({ user: result.data.user }));
          }
        } catch (err) {
          console.error('Error in loadUser:', err);
        }
      },
    }),

    updateUser: builder.mutation({
      query: (inputdata) => ({
        url: 'profile/update',
        method: 'PUT',
        body: inputdata,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authAPI;

    })
})

export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation,useLoadUserQuery,useUpdateUserMutation}=authAPI;
