import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authAPI } from "@/features/api/authAPI";
import { courseApi } from "@/features/api/courseAPI";
import { purchaseApi } from "@/features/api/purchaseAPI";
import { progressApi } from "@/features/api/progressAPI";

export const appStore=configureStore({
    reducer:rootReducer,
    middleware: (defaultMiddleware)=> defaultMiddleware().concat(authAPI.middleware,courseApi.middleware,purchaseApi.middleware,progressApi.middleware)
})

const initializeApp =async ()=>{
      await appStore.dispatch(authAPI.endpoints.loadUser.initiate({},{forceRefetch:true}))
}
initializeApp();