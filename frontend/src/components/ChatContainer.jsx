import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';

import { useChatStore } from '../store/useChatStore.js'
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMessageTime } from '../lib/utils.js';

import { IoIosArrowDown } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';

const ChatContainer = () => {

  const { selectedUser, setSelectedUser, messages, isMessagesLoading, getMessages, deleteMessage, removeMessage, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();

  const containerRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 70);
  }, [messages, selectedUser]);

  const handleDeleteMessage = async (message) => {
    try {
      if (message.senderId == authUser._id) {
        await deleteMessage(message._id)
      } else {
        await removeMessage(message._id)
      }
    } catch (error) {
      console.log('Failed to delete the message', error)
    }
  }

  const copyMessage = (message) => {
    navigator.clipboard.writeText(message)
    toast.success("Copied to clipboard")
  }

  const handleEscKey = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      setSelectedUser(null);
    }
  }
  document.addEventListener('keydown', handleEscKey);

  if (isMessagesLoading) {
    return (
      <article className='h-full w-full flex flex-col'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </article>
    )
  }

  return (
    <article className='h-full w-full flex flex-col relative'>
      <ChatHeader />

      <div ref={containerRef} className='my-3 flex-1 overflow-y-auto'>

        {messages.length == 0 ?
          <div className='text-center p-4'>
            <span className='text-md font-semibold'>Send a message to start conversation</span>
          </div> :
          messages.map((message, index) => {
            return (
              <div
                key={message._id}
                className={`chat mx-3 ${message.senderId === authUser._id ? "chat-end" : message.visible ? "chat-start" : " chat-start hidden"}`} >

                <div
                  className={`chat-bubble shadow-sm p-2 relative group ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}`}>

                  <div className="flex flex-col">
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[300px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                    <span className={`mt-1 text-[10px] ${message.senderId === authUser._id ? "text-primary-content/70 self-end" : "text-base-content/70"}`}>{formatMessageTime(message.createdAt)}</span>
                  </div>

                  <div
                    className={`dropdown absolute hidden group-hover:block top-0 
                      ${message.senderId === authUser._id ? " dropdown-left dropdown-start right-0" : "dropdown-right left-0"}`
                    }>
                    {<div tabIndex={0} role="button" className="dropBtn bg-base-200/80 text-base-content rounded-full p-1"><IoIosArrowDown /></div>}

                    <ul tabIndex={0} className="dropdown-content menu bg-base-200 text-base-content rounded-lg z-[1] w-52 p-1 shadow">
                      {message.text && <li
                        onClick={() => copyMessage(message.text)}>
                        <a><FaCopy className='text-lg' />Copy Message</a>
                      </li>}
                      <li
                        onClick={() => handleDeleteMessage(message)}>
                        <a><MdDelete className='text-lg' />{`${message.senderId === authUser._id ? "Unsend Message" : "Delete Message"}`}</a>
                      </li>
                    </ul>

                  </div>
                </div>

              </div>
            )
          })
        }

      </div>

      <MessageInput />
    </article>
  )
}

export default ChatContainer
