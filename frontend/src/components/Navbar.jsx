import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { FaUserFriends } from "react-icons/fa";
import { IoColorFill } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { Link } from 'react-router-dom';

import { useFriendsStore } from '../store/useFriendsStore';

const Navbar = () => {

  const { authUser } = useAuthStore();
  const { requestsReceived } = useFriendsStore();
  const { incomingRequests } = useFriendsStore();
  
  useEffect(() => {
    incomingRequests();
  }, [])

  const number = requestsReceived.length;

  return (
    <nav className='flex justify-between items-center px-3 h-16 shadow-md'>
      <Link to='/' className="logo flex items-center gap-1 select-none">
        <img src="./whispersLogo.png" className='h-8' alt="logo" />
        <span className='text-xl align-middle font-semibold'>Whispers</span>
      </Link>

      <div className="links flex gap-2 sm:gap-8 mx-2 sm:mx-5">

        {
          authUser && 
          <Link to="/notifications" className="friends flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0 indicator">
            <IoMdNotifications className='text-xl' />
            {
              number > 0 && <span className="indicator-item badge badge-secondary w-min">{number}</span>
            }
            <span className='text-lg hidden sm:block'>Notifications</span>
          </Link>
        }

        {
          authUser && 
          <Link to="/friends" className="friends flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
            <FaUserFriends className='text-xl' />
            <span className='text-lg hidden sm:block'>Friends</span>
          </Link>
        }

        <Link to="/settings" className="settings flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
          <IoColorFill className='text-xl' />
          <span className='text-lg hidden sm:block'>Themes</span>
        </Link>

        {
          authUser &&
          <Link to="/profile" className="profile flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
            <FaUserCircle className='text-xl' />
            <span className='text-lg hidden sm:block'>Profile</span>
          </Link>
        }

      </div>
    </nav>
  )
}

export default Navbar
