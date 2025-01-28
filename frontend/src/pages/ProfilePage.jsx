import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { getLetters } from '../lib/utils';
import toast from 'react-hot-toast';

import { IoMdCamera } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdVerified } from "react-icons/md";

const ProfilePage = () => {

  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePicture: base64Image })
    }
  }

  return (
    <main className='flex flex-col justify-center items-center flex-grow gap-4 lg:w-1/3 md:w-1/2 sm:w-3/4 mx-6 p-8 sm:mx-auto my-10 rounded-md bg-base-200'>
      <h2 className='text-3xl font-bold'>Your Profile</h2>

      <div className="ProfilePic relative">
        <div className="ring-primary ring-offset-base-100 w-36 rounded-full ring ring-offset-4">
          <div className="avatar placeholder flex items-center justify-center">
            {authUser.verified ? <MdVerified className='absolute top-0 right-0 border-[3px] border-primary fill-blue-500 p-[2px] text-3xl bg-base-200 rounded-full' /> : ""}
            <div className="bg-neutral text-neutral-content w-full rounded-full ">
              {authUser.profilePicture ?
                <img src={authUser.profilePicture} /> :
                <span className="text-3xl">{getLetters(authUser.fullName)}</span>
              }
            </div>
          </div>
        </div>
        <label htmlFor="profilePic" >
          <IoMdCamera className='absolute bottom-0 right-0 rounded-full bg-primary p-1 text-3xl text-base-200' />
          <input
            type="file"
            className='hidden'
            id='profilePic'
            accept="image/*"
            onChange={handleImageUpdate}
            disabled={isUpdatingProfile}
          />
        </label>
      </div>

      <small className={`text-sm  ${isUpdatingProfile ? "animate-pulse" : ""}`}>
        {isUpdatingProfile ? "Updating..." : "Click the camera icon to edit your profile pic"}
      </small>

      <div className="details w-full flex flex-col gap-4">
        <div>
          <small className='flex items-center m-1 gap-1'><FaUser />Full Name</small>
          <input
            type="text"
            className="input input-bordered flex-1 text-sm h-10 w-full focus-within:outline-none"
            value={authUser?.fullName}
            readOnly
          />
        </div>

        <div>
          <small className='flex items-center m-1 gap-1'><IoMail />Email Address</small>
          <input
            type="text"
            className="input input-bordered flex-1 text-sm h-10 w-full focus-within:outline-none"
            value={authUser?.email}
            readOnly
          />
        </div>
      </div>

      <div className="info w-full my-1">
        <div className='flex justify-between items-center'>
          <span>Member since</span>
          <small>{authUser.createdAt?.split('T')[0]}</small>
        </div>
        <hr className='border-[1.5px] border-primary border-opacity-20 my-2' />
        <div className='flex justify-between items-center'>
          <span>Account Status</span>
          <span className='text-green-500'>Active</span>
        </div>
      </div>

    </main>
  )
}

export default ProfilePage
