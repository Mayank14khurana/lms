import React from 'react'
import { FaSchool } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { Menu, Store } from "lucide-react";
import DarkMode from '../DarkMode';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authAPI';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".dropdown")) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
    navigate('/');
  }
  useEffect(() => {
    toast.success(data?.message || "Log out successfully");
  }, [isSuccess])

  return (
    <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-20'>
      <div className=' max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
        <Link to='/'>
          <div className='flex items-center gap-2'>
            <FaSchool className='text-2xl' />
            <h1 className='hidden md:block font-extrabold text-2xl'>E-Learning</h1>
          </div>
        </Link>

        <div className='flex items-center gap-8'>
          {
            user ? (
              <div className="relative dropdown">
                <button className="flex items-center gap-2" onClick={toggleDropdown}>
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="User Avatar"
                  />
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg">
                    <div className="px-4 py-2 text-sm font-bold">My Account</div>
                    <div className="border-t dark:border-gray-700"></div>
                    <ul className="py-2">
                      <Link to='/mylearning'><li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        My Learning
                      </li></Link>

                      <Link to='/profile'><li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Edit Profile
                      </li></Link>

                      <li
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <button onClick={logoutHandler}>Log out</button>
                      </li>
                    </ul>
                    <div className="border-t dark:border-gray-700"></div>

                    {user?.role === "instructor" && (
                      <>
                        <div className="border-t dark:border-gray-700"></div>
                        <ul> <Link to='/admin/dashboard'>
                        <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Dashboard
                          </li>
                        </Link>
                          
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button variant="outline " className='border dark:border-b-gray-800 border-b-gray-200 p-2 rounded-lg ' onClick={() => navigate('/login')} >Login</button>
                <button className='border dark:border-b-gray-800 border-b-gray-200 p-2 rounded-lg bg-black text-white' onClick={() => navigate('/login')} >Signup</button>
              </div>
            )
          }
          <DarkMode />
        </div>

      </div>
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-learning</h1>
        <MobileNavbar user={user} />
      </div>
    </div>
  )
}

export default Navbar

const MobileNavbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate =useNavigate();
  const toggleSheet = () => setIsOpen(!isOpen);
  return (
    <div>
      <button
        onClick={toggleSheet}
        className="rounded-full hover:bg-gray-200 p-2 border border-gray-300"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
          <div className="bg-white w-64 h-full shadow-lg flex flex-col p-4">
            <div className=" mb-4 flex ml-auto">
              <button
                onClick={toggleSheet}
                className="text-gray-600 hover:text-gray-800 text-3xl "
              >
                ×
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-black">
                E-Learning
              </h2>
              <DarkMode />
            </div>

            <hr className="border-gray-300 mb-4" />

            <nav className="flex flex-col space-y-4">
              <a href="/my-learning" className="text-gray-700 hover:text-gray-900">
                My Learning
              </a>
              <a href="/profile" className="text-gray-700 hover:text-gray-900">
                Edit Profile
              </a>
              <p
                className="text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                <button >Log out</button>
              </p>
            </nav>

            {user?.role === "instructor" && (
              <div className="mt-auto">
                <button
                  onClick={() => {

                    toggleSheet();
                    navigate('/admin/dashboard')
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
