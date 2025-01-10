import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { IoIosSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';

const Navbar = () => {

  const { logout, authUser } = useAuthStore()

  return (
    <nav className='flex justify-between items-center px-3 h-16 shadow-md'>
      <Link to='/' className="logo flex items-center gap-1 select-none">
        <img src="./whispersLogo.png" className='h-8' alt="logo" />
        <span className='text-xl align-middle font-semibold'>Whispers</span>
      </Link>

      <div className="links flex gap-2 sm:gap-8 mx-5">

        <Link to="/settings" className="settings flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
          <IoIosSettings className='text-xl' />
          <span className='text-lg hidden sm:block'>Settings</span>
        </Link>

        {authUser && <>
          <Link to="/profile" className="profile flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
            <CgProfile className='text-xl' />
            <span className='text-lg hidden sm:block'>Profile</span>
          </Link>

          <div onClick={logout} className="logout flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
            <MdLogout className='text-xl' />
            <span className='text-lg hidden sm:block'>Logout</span>
          </div>
        </>}

      </div>
    </nav>
  )
}

export default Navbar
