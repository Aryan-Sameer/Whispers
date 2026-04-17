import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { getLetters } from '../lib/utils';
import toast from 'react-hot-toast';

import { MdLogout } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdCamera } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { BsPencilSquare } from "react-icons/bs";

const ProfilePage = () => {

  const { authUser, isUpdatingProfile, updateProfile, updateBio, updateName, logout, deleteAccount } = useAuthStore();
  const [editingBio, setEditingBio] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameText, setNameText] = useState(authUser?.fullName || "");
  const [bioText, setBioText] = useState(authUser?.bio || "");
  const nameInputRef = useRef(null)
  const bioInputRef = useRef(null)

  useEffect(() => {
    setNameText(authUser?.fullName || "");
    setBioText(authUser?.bio || "");
  }, [authUser?.fullName, authUser?.bio]);

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
      await updateProfile({ profilePicture: base64Image })
    }
  }

  return (
    <main className='flex flex-col justify-center items-center gap-4 lg:w-1/3 md:w-1/2 sm:w-3/4 mx-6 p-8 sm:mx-auto my-10 rounded-md bg-base-200'>
      <h2 className='text-3xl font-bold'>Your Profile</h2>

      <div className="ProfilePic relative">
        <div className="ring-primary ring-offset-base-100 w-36 rounded-full ring ring-offset-4">
          <div className="avatar placeholder flex items-center justify-center">
            <div className="bg-neutral text-neutral-content w-full rounded-full ">
              {authUser.profilePicture ?
                <img src={authUser.profilePicture} loading='lazy' /> :
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
          <div className='flex gap-2 items-center'>
            <input
              ref={nameInputRef}
              type="text"
              className="input input-bordered flex-1 text-sm h-10 w-full focus-within:outline-none"
              value={nameText}
              onChange={(e) => setNameText(e.target.value)}
              readOnly={!editingName}
            />
            <button
              className='btn btn-sm btn-primary'
              onClick={() => {
                const next = !editingName;
                setEditingName(next);
                if (next) {
                  setTimeout(() => nameInputRef.current?.focus(), 0);
                } else {
                  updateName({ fullName: nameText.trim() });
                }
              }}>
              {!editingName ? "Edit" : "Save"}
            </button>
          </div>
        </div>

        <div>
          <small className='flex items-center m-1 gap-1'><BsPencilSquare />Your Bio</small>
          <div className='flex items-center gap-2'>
            <textarea
              ref={bioInputRef}
              onChange={(e) => {
                e.target.value.length < 60 ?
                  setBioText(e.target.value) : ""
              }}
              className="textarea flex-1 text-sm h-10 w-full focus-within:outline-none"
              value={bioText}
              readOnly={!editingBio}
            />

            <button
              className='btn btn-sm btn-primary'
              onClick={() => {
                setEditingBio(!editingBio);
                !editingBio ? bioInputRef.current.focus() : updateBio({ bio: bioText.trim() });
              }}>{!editingBio ? "Edit" : "Save"}
            </button>
          </div>
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
          <span>Member Since</span>
          <small>{authUser.createdAt?.split('T')[0]}</small>
        </div>

        <hr className='border-[1.5px] border-primary border-opacity-20 my-2' />

        <div className='flex justify-between'>
          <span
            onClick={() => document.getElementById('logout_modal').showModal()}
            className='text-red-500 font-bold flex items-center gap-2 cursor-pointer w-fit select-none'>
            <MdLogout className='text-xl' /> Logout
          </span>

          <span
            onClick={() => document.getElementById('delete_account_modal').showModal()}
            className='text-red-500 font-bold flex items-center gap-2 cursor-pointer w-fit select-none'>
            <MdDeleteOutline className='text-xl'/> Delete Account
          </span>
        </div>

        <dialog id="logout_modal" className="modal modal-bottom sm:modal-middle">
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

        <dialog id="delete_account_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <p className="py-2 text-red-500 font-medium">Are you sure to delete your account? This cannot be undone.</p>
            <div className="modal-action">
              <button onClick={deleteAccount} className='btn bg-red-500 hover:bg-red-600 text-white border-none'>Yes, Delete</button>
              <form method="dialog">
                <button className="btn">No</button>
              </form>
            </div>
          </div>
        </dialog>

      </div>

    </main>
  )
}

export default ProfilePage
