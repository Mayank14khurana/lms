import { Button } from '@/components/ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseAPI'
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const PurchaseCourseButton = ({courseId}) => {
  const [createCheckout,{data,isLoading,error,isSuccess}] =useCreateCheckoutSessionMutation();
  const purchaseHandler= async ()=>{
    await createCheckout(courseId);
  }
  useEffect(()=>{
     if(isSuccess){
     if(data?.url){
      window.location.href=data.url;
     }
     else{
      toast.error("Error ocurred while redirecting")
     }
     }
     if(error){
        toast.error(error.data.message ||"Failed to create checkout");
     }
  },[ data,isSuccess,isLoading,error])
  return (
    <div>
       <Button className='w-full' onClick={purchaseHandler}  disabled={isLoading}> Purchase Course</Button>  
    </div>
  )
}

export default PurchaseCourseButton
