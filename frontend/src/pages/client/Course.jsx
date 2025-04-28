import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  console.log(course)
  return (
    <Link to={`/course-details/${course._id}`}>
      <div className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={course?.courseThumbnail }
            alt="course"
            className="w-full h-36 object-cover rounded-t-lg"
          />
        </div>
        <div className="px-5 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            {course?.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img
                  src={course?.creator?.photoUrl}
                  alt="@shadcn"
                  className="object-cover h-full w-full"
                />
              </div>
              <h1 className="font-medium text-sm">{course?.creator?.name }</h1>
            </div>
            <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
              {course?.courseLevel}
            </span>
          </div>
          <div className="text-lg font-bold">
            Rs <span>{course?.coursePrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Course;
