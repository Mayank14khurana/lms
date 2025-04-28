import React, { useEffect } from 'react'
import Course from './Course';
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authAPI';
import { useState } from 'react';
import { toast } from 'sonner';

const Profile = () => {

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  }
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();

 

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('photo', photo);
    await updateUser(formData);
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Profile updated");
    }
    if (isError) {
      toast.error(error.message || "Failed to update the profile")
    }
  }, [isError, updateUserData, isSuccess])

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <h1>Loading...</h1>
  if (!data) return <h1>Error loading profile</h1>;
  const user = data && data.user;
  console.log(user)
  return (
    <div className='max-w-4xl mx-auto px-4 my-24'>
      <h1 className='font-bold text-2xl text-center md:text-left '>Profile</h1>
      <div className='flex flex-col md:flex-row items-center md:items-start  gap-8'>
        <div className='flex flex-col items-center'>
          <div className="h-24 w-24 md:h-32 md:w-32 mb-4 rounded-full overflow-hidden border border-gray-300">
            <img
              src={user.photoUrl || "https://github.com/shadcn.png"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className='mb-2'>
            <h2 className='font-semibold text-gray-900 dark:text-gray-100 '>Name :<span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user?.name}</span>
            </h2>
          </div>
          <div className='mb-2'>
            <h2 className='font-semibold text-gray-900 dark:text-gray-100 '>Email :<span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user?.email}</span>
            </h2>
          </div>
          <div className='mb-2'>
            <h2 className='font-semibold text-gray-900 dark:text-gray-100 '>Role :<span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>{user?.role?.toUpperCase()}</span>
            </h2>
          </div>
          <button
            onClick={() => document.getElementById("editProfileModal").showModal()}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
          <dialog id="editProfileModal" className="p-6 bg-white shadow-lg rounded-lg w-92 mx-auto mt-32">
            <h2 className="text-lg font-bold mb-2">Edit Profile</h2>
            <p className="text-sm text-gray-600 mb-4">Make changes to your profile here. Click save when you're done.</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Profile Photo</label>
              <input
                onChange={onChangeHandler}
                type="file"
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => document.getElementById("editProfileModal").close()}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={updateUserIsLoading}
                onClick={updateUserHandler}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {updateUserIsLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </dialog>
        </div>
      </div>
      <div>
        <h1 className='font-medium text-lg mt-8'>Courses you are enrolled in</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
          {
            user?.enrolledCourses.length === 0 ? <h1>You have not enrolled in any course </h1> : (
              user?.enrolledCourses.map((course, index) => (
                <Course course={course} key={course.id} />
              ))
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Profile