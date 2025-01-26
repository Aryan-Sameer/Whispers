import React, { useState, useEffect } from 'react'
import SidebarSkeleton from './skeletons/SideBarSkeleton.jsx';
import { useChatStore } from '../store/useChatStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { getLetters } from '../lib/utils.js';

import { HiUsers } from "react-icons/hi2";
import { MdVerified } from "react-icons/md";

const SideBar = () => {

    const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers])

    const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;

    if (isUsersLoading) {
        return (
            <SidebarSkeleton />
        )
    }

    return (
        <aside className="h-full lg:w-80 md:w-60 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="w-full p-1 sm:p-3">
                <div className="flex items-center gap-2">
                    <HiUsers className='text-4xl md:text-2xl m-auto md:m-0' />
                    <span className="font-medium hidden md:block text-2xl">Chats</span>
                </div>

                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>

            </div>

            <div className="chatList overflow-y-auto w-full">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-2 sm:p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
                        <div className="relative mx-auto md:mx-0 flex items-center justify-center bg-primary min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 text-primary-content rounded-full ">
                            {user.profilePicture ?
                                <img src={user.profilePicture} className="size-10 sm:size-12 object-cover rounded-full" /> :
                                <span className="text-lg">{getLetters(user.fullName)}</span>
                            }
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-1 ring-green-700"
                                />
                            )}
                        </div>

                        <div className="hidden md:block text-left min-w-0">
                            <div className="font-medium truncate flex items-center gap-1">{user?.fullName} {user.verified ? <MdVerified /> : ""}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user?._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {(filteredUsers.length === 0 && users.length !== 0) && (
                    <div className="text-center text-zinc-500 py-4 select-none">No online users</div>
                )}

            </div>
        </aside>
    )
}

export default SideBar
