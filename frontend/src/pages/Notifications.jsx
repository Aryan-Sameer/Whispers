import React, { useEffect } from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

import { useFriendsStore } from '../store/useFriendsStore'
import { getLetters } from '../lib/utils';

const Notifications = () => {

  const {
    requestsReceived,
    incomingRequests,
    rejectRequest,
    acceptRequest
  } = useFriendsStore();

  return (
    <main className='mx-auto my-6 px-4 w-full sm:w-[80%] lg:w-3/4'>
      <h1 className='text-xl font-bold my-2'>Friend Requests</h1>
      {
        requestsReceived.length === 0 &&
        <span>No friend requests received</span>
      }
      {
        requestsReceived.map((request) => {
          return (
            <div
              key={request._id}
              className="w-full p-3 flex items-center gap-3 transition-colors rounded-md bg-base-200 my-2">
              <div className="relative md:mx-0 flex items-center justify-center bg-primary min-w-12 min-h-12 sm:w-10 sm:h-10 text-primary-content rounded-full ">
                {request.sender.profilePicture ?
                  <img src={request.sender.profilePicture} className="size-12 object-cover rounded-full" /> :
                  <span className="text-lg">{getLetters(request.sender.fullName)}</span>
                }
              </div>

              <div className="block text-left min-w-0">
                <div className="font-medium truncate flex items-center gap-1">
                  {request.sender?.fullName}
                </div>
                <div className="text-xs text-ellipsis overflow-hidden">
                  {request.sender.email}
                </div>
              </div>

              <div className="join ml-auto">
                <button
                  onClick={() => acceptRequest(request._id)}
                  className="btn p-2">
                  <FaCheckCircle className='text-xl text-green-500' />
                  <span className='hidden md:block'>Accept</span>
                </button>
                <button
                  onClick={() => rejectRequest(request._id)}
                  className="btn p-2">
                  <FaCircleXmark className='text-xl text-red-500' />
                  <span className='hidden md:block'>Reject</span>
                </button>
              </div>
            </div>
          )
        })
      }
    </main>
  )
}

export default Notifications
