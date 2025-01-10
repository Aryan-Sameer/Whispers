import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';

import { useChatStore } from '../store/useChatStore.js'
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMessageTime } from '../lib/utils.js';

const ChatContainer = () => {

  const { selectedUser, setSelectedUser, messages, isMessagesLoading, getMessages, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ block: "end" });
    }
  }, [messages, selectedUser]);

  function handleEscKey(event) {
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

      <div className='my-3 flex-1 overflow-y-auto'>
        {messages.length == 0 ?
          <div className='text-center p-4'>
            <span className='text-md font-semibold'>Send a message to start conversation</span>
          </div> :
          messages.map((message) => {
            return (
              <div
                key={message._id}
                className={`chat mx-3 ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                ref={messageEndRef}>
                <div className={`chat-bubble shadow-sm p-2 ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}`}>
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
