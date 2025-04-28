import { useGetCourseDetailsWithStatusQuery } from '../features/api/purchaseAPI'
import { useParams,Navigate } from "react-router-dom";

const ProtectPurchase = ({children})=>{
  const {courseId} =useParams();
  const {data,isLoading} =useGetCourseDetailsWithStatusQuery(courseId);

  if(isLoading) return <p>Loading ....</p>
  return data?.purchased ? children :<Navigate to={`/course-details/${courseId}`} />
}

export default ProtectPurchase;