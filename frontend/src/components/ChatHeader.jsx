import React from 'react'
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { IoMdClose } from "react-icons/io";
import { MdVerified } from 'react-icons/md';

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300 bg-base-200/50">
            <div className="flex items-center justify-between">
                <div onClick={() => (setShowInfo(!showInfo))} className="flex items-center gap-3 select-none">
                    <div className="profilePic">
                        <div className="relative mx-auto lg:mx-0 flex items-center justify-center bg-primary size-10 sm:size-12 text-primary-content rounded-full ">
                            {selectedUser.profilePicture ?
                                <img src={selectedUser.profilePicture} className="size-10 sm:size-12 object-cover rounded-full" /> :
                                <span className="text-lg">{selectedUser.fullName.slice(0, 2).toUpperCase()}</span>
                            }
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium flex items-center gap-1">{selectedUser.fullName} <span className='block md:hidden'>{selectedUser.verified ? <MdVerified /> : ""}</span></h3>
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
