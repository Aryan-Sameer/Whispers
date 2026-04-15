import { useState, useEffect } from 'react'
import SidebarSkeleton from './skeletons/SideBarSkeleton.jsx';

import { useChatStore } from '../store/useChatStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useFriendsStore } from '../store/useFriendsStore.js';
import { useGroupChatStore } from '../store/useGroupChatStore.js';
import { getLetters } from '../lib/utils.js';

import { HiUsers } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";

const SideBar = () => {

    const { selectedUser, setSelectedUser } = useChatStore();
    const { selectedGroup, setSelectedGroup, groups, getMyGroups, createGroup, isGroupsLoading } = useGroupChatStore();
    const { getUsers, users, isUsersLoading } = useFriendsStore();
    const { authUser, onlineUsers } = useAuthStore();

    const [activeTab, setActiveTab] = useState("chats");
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        getUsers();
        getMyGroups();
    }, [getUsers, getMyGroups])

    const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) :
        [
            ...users.filter((user) => user._id === authUser._id),
            ...users.filter((user) => user._id !== authUser._id),
        ]

    if (isUsersLoading || isGroupsLoading) {
        return (
            <SidebarSkeleton />
        )
    }

    const handleCreateGroup = async () => {
        const name = groupName.trim();
        if (!name) return;
        const group = await createGroup({ name });
        if (group) {
            setGroupName("");
            setActiveTab("groups");
            setSelectedUser(null);
        }
    }

    return (
        <aside className="h-full lg:w-80 md:w-60 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="chatList overflow-y-auto w-full">

                <div className="w-full p-3 select-none mx-auto">
                    <div className="tabs tabs-boxed p-1">
                        <button
                            type="button"
                            className={`tab flex-1 ${activeTab === "chats" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("chats")}>
                            Chats
                        </button>
                        <button
                            type="button"
                            className={`tab flex-1 ${activeTab === "groups" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("groups")}>
                            Groups
                        </button>
                    </div>

                    {activeTab === "chats" && (
                        <>
                            {users.length > 1 ?
                                <div className="mt-3 flex items-center gap-2">
                                    <label className="cursor-pointer flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={showOnlineOnly}
                                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                                            className="checkbox checkbox-sm"
                                        />
                                        <span className="text-sm">Show online</span>
                                    </label>
                                    <span className="text-xs text-zinc-500">{onlineUsers.length} online</span>
                                </div> :
                                <Link
                                    to="/friends"
                                    className="text-center text-zinc-500 select-none">
                                    Click to connect with a friend
                                </Link>
                            }
                        </>
                    )}

                    {activeTab === "groups" && (
                        <>
                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="New group name"
                                    className="input input-sm input-bordered rounded-full w-full focus-within:outline-none"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleCreateGroup}
                                    disabled={!groupName.trim()}
                                    aria-label="Create group">
                                    <IoMdAdd />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {activeTab === "chats" && filteredUsers.map((user, idx) => (
                    <button
                        key={user._id}
                        onClick={() => {
                            setSelectedGroup(null);
                            setSelectedUser(user);
                        }}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                            ${idx % 2 === 0 ? "max-md:bg-base-100" : ""}`}>
                        <div className="relative md:mx-0 flex items-center justify-center bg-primary min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 text-primary-content rounded-full ">
                            {user.profilePicture ?
                                <img src={user.profilePicture} className="size-12 object-cover rounded-full" loading='lazy' /> :
                                <span className="text-lg">{getLetters(user.fullName)}</span>
                            }
                            {authUser._id != user._id && onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-1 ring-green-700"
                                />
                            )}
                        </div>

                        <div className="block text-left min-w-0">
                            <div className="font-medium truncate flex items-center gap-1">
                                {user?.fullName} {authUser._id == user._id ? "(You)" : ""}
                            </div>

                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user?._id) ? "Online" : "Offline"}
                            </div>
                        </div>

                    </button>
                ))}

                {activeTab === "chats" && (filteredUsers.length === 0 && users.length !== 0) && (
                    <div className="text-center text-zinc-500 py-4 select-none">No online users</div>
                )}

                {activeTab === "groups" && groups.map((group, idx) => (
                    <button
                        key={group._id}
                        onClick={() => {
                            setSelectedUser(null);
                            setSelectedGroup(group);
                        }}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                            ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                            ${idx % 2 === 0 ? "max-md:bg-base-100" : ""}`}>
                        <div className="relative md:mx-0 flex items-center justify-center bg-primary min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 text-primary-content rounded-full ">
                            <span className="text-lg">{getLetters(group.name)}</span>
                        </div>
                        <div className="block text-left min-w-0">
                            <div className="font-medium truncate">{group.name}</div>
                            <div className="text-sm text-zinc-400">{group.members?.length || 0} members</div>
                        </div>
                    </button>
                ))}
                {activeTab === "groups" && groups.length === 0 && (
                    <div className="text-center text-zinc-500 py-4 select-none">No groups yet. Create one.</div>
                )}

            </div>

            <span className='mt-auto mx-3 my-1'>
                <a target='_blank' href="https://github.com/Aryan-Sameer/Whispers.git" className="text-sm hover:text-blue-600 hover:underline">
                    Learn More
                </a>
            </span>
        </aside>
    )
}

export default SideBar
