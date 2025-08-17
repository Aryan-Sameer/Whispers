import React from 'react'
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useFriendsStore } from '../store/useFriendsStore'
import { getLetters } from '../lib/utils.js';

import { IoMdClose } from "react-icons/io";
import { IoPersonRemove } from "react-icons/io5";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const { authUser } = useAuthStore();
    const { removeFriend } = useFriendsStore();

    return (
        <div className="p-2.5 border-b border-base-300 bg-base-200/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 select-none">
                    <div className="profilePic">
                        <div className="relative mx-auto lg:mx-0 flex items-center justify-center bg-primary size-10 sm:size-12 text-primary-content rounded-full ">
                            {selectedUser.profilePicture ?
                                <img src={selectedUser.profilePicture} className="size-10 sm:size-12 object-cover rounded-full" /> :
                                <span className="text-lg">{getLetters(selectedUser.fullName)}</span>
                            }
                        </div>
                    </div>

                    <div>
                        <div className="dropdown dropdown-start z-10 w-fit">
                            <h3
                                tabIndex={0}
                                className="font-medium flex items-center gap-1 cursor-pointer">
                                {selectedUser.fullName} {authUser._id == selectedUser._id ? "(You)" : ""}
                            </h3>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <li><a
                                    onClick={() => {
                                        removeFriend(selectedUser._id)
                                        setSelectedUser(null);
                                    }}
                                    className='text-red-500'>
                                    Remove Friend <IoPersonRemove />
                                </a>
                                </li>
                            </ul>
                        </div>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                <button onClick={() => setSelectedUser(null)} className='bg-base-200 rounded-full p-1 m-1'>
                    <IoMdClose className='size-6' />
                </button>
            </div>

        </div>
    );
};
export default ChatHeader;
