import React, { useEffect, useState } from 'react'
import { useFriendsStore } from '../store/useFriendsStore'
import { getLetters } from '../lib/utils';
import FriendsSkeleton from '../components/skeletons/FriendsSkeleton';

const FriendsPage = () => {

  const {
    recommendedUsers,
    getRecommendedUsers,
    isFetchingUsers,
    sendRequest,
    isSendingRequest,
    outgoingRequests,
    cancelRequest,
    requestsSent
  } = useFriendsStore();

  const [searchText, setSearchText] = useState("");
  const [outGoingset, setOutGoingset] = useState(new Set());

  useEffect(() => {
    getRecommendedUsers();
    outgoingRequests();
  }, [])

  useEffect(() => {
    const newset = new Set();
    requestsSent.forEach(element => {
      newset.add(element.recipient._id);
    });
    setOutGoingset(newset);
  }, [requestsSent])

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  }

  const usersToMap = recommendedUsers.filter((value) => value.fullName.toLowerCase().startsWith(searchText.toLowerCase()))

  if (isFetchingUsers) {
    return (
      <FriendsSkeleton />
    )
  }

  return (
    <main>
      <div className='flex flex-col items-center gap-1 px-4'>
        <h1 className='text-xl font-bold mt-4'>People you might know</h1>
        <input
          type="text"
          name="search"
          placeholder="Search User"
          className="input input-sm input-bordered focus-within:outline-none w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] mt-2"
          onChange={handleSearch}
        />
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto my-6 sm:w-[80%] lg:w-3/4 gap-2 px-4'>
        {usersToMap.length === 0 ? <span>No users found!</span> : ""}
        {usersToMap.map((user, index) => {
          const requestSent = outGoingset.has(user._id);
          if (index < 12)
            return (
              <div key={user._id} className='flex flex-col bg-base-200 rounded-md p-2 gap-2'>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center justify-center bg-primary w-12 h-12 text-primary-content rounded-full">
                    {user.profilePicture ?
                      <img src={user.profilePicture} className="size-12 object-cover rounded-full" /> :
                      <span className="text-lg">{getLetters(user.fullName)}</span>
                    }
                  </div>

                  <div className="block text-left min-w-0">
                    <div className="font-medium truncate flex items-center gap-1">{user?.fullName}</div>
                    <div className="text-xs text-ellipsis overflow-hidden">
                      {user.email}
                    </div>
                  </div>

                </div>

                <div className="text-sm">
                  {user?.bio ? `Bio: ${user.bio}` : ""}
                </div>

                <button
                  onClick={() => {
                    !requestSent ? sendRequest(user._id) :
                      cancelRequest(user._id);
                  }}
                  className={`btn btn-sm btn-primary mt-auto
                    ${requestSent ? "bg-red-500 hover:bg-red-600 text-white border-none" : ""}`
                  }>
                  {
                    !isSendingRequest ?
                      requestSent ? "Cancel Request" : "Add Friend" :
                      "Sending Request..."
                  }
                </button>
              </div>
            )
        })}
      </div>
    </main>
  )
}

export default FriendsPage
