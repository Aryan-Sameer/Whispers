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

      <div className="links flex gap-2 sm:gap-8 mx-2 sm:mx-5">

        <Link to="/settings" className="settings flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
          <IoIosSettings className='text-xl' />
          <span className='text-lg hidden sm:block'>Settings</span>
        </Link>

        {authUser && <>
          <Link to="/profile" className="profile flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0">
            <CgProfile className='text-xl' />
            <span className='text-lg hidden sm:block'>Profile</span>
          </Link>

          <div
            className="flex items-center gap-1 cursor-pointer rounded-full bg-base-200 p-2 sm:py-0"
            onClick={() => document.getElementById('my_modal_5').showModal()}>
            <MdLogout className='text-xl' />
            <span className='text-lg hidden sm:block'>Logout</span>
          </div>

          <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <p className="py-2">Are you sure to logout from your account?</p>
              <div className="modal-action">
                <button onClick={logout} className='btn'>Yes</button>
                <form method="dialog">
                  <button className="btn">No</button>
                </form>
              </div>
            </div>
          </dialog>
        </>}

      </div>
    </nav>
  )
}

export default Navbar
