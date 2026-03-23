import { useCallback, useEffect, useRef } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

import GroupChatHeader from "./GroupChatHeader.jsx";
import GroupMessageInput from "./GroupMessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";

import { formatMessageTime } from "../lib/utils.js";
import { IoIosArrowDown } from "react-icons/io";
import { FaCopy } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

import toast from "react-hot-toast";

const GroupChatContainer = () => {
  const {
    selectedGroup,
    setSelectedGroup,
    messages,
    isMessagesLoading,
    getGroupMessages,
    deleteGroupMessage,
    removeGroupMessage,
    isMessageDeleting,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupChatStore();

  const { authUser } = useAuthStore();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!selectedGroup) return;
    getGroupMessages(selectedGroup._id);
    subscribeToGroupMessages();

    return () => {
      unsubscribeFromGroupMessages(selectedGroup._id);
    };
  }, [selectedGroup?._id, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  useEffect(() => {
    if (!containerRef.current) return;
    setTimeout(() => {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 70);
  }, [messages, selectedGroup]);

  const handleDeleteMessage = async (message) => {
    try {
      if (message.senderId === authUser._id) {
        await deleteGroupMessage(message._id);
      } else {
        await removeGroupMessage(message._id);
      }
    } catch (error) {
      console.log("Failed to handle message delete:", error);
      toast.error("Failed to update message");
    }
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleEscKey = useCallback((event) => {
    if (event.key === "Escape" || event.key === "Esc") {
      setSelectedGroup(null);
    }
  }, [setSelectedGroup]);
  useEffect(() => {
    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [handleEscKey]);

  if (isMessagesLoading) {
    return (
      <article className="h-full w-full flex flex-col">
        <GroupChatHeader />
        <MessageSkeleton />
        <GroupMessageInput />
      </article>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!selectedGroup) return null;

  return (
    <article className="h-full w-full flex flex-col relative">
      <GroupChatHeader />

      <div ref={containerRef} className="my-1 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center p-4">
            <span className="text-md font-semibold select-none">Send a message to start conversation</span>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate =
              index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

            return (
              <div key={message._id}>
                {showDate && (
                  <div className="date-indicator text-center my-1">
                    <small className="bg-base-200 p-1 px-2 rounded-sm">{formatDate(message.createdAt)}</small>
                  </div>
                )}

                <div
                  className={`chat mx-2 sm:mx-3 ${
                    message.senderId === authUser._id ? "chat-end" : message.visible ? "chat-start" : "chat-start hidden"
                  }`}
                >
                  <div
                    className={`chat-bubble shadow-sm p-2 pb-1 relative group ${
                      message.senderId === authUser._id
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content"
                    }`}
                  >
                    <div className="flex flex-col">
                      {message.image && (
                        <img
                          loading="lazy"
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[300px] rounded-md"
                        />
                      )}
                      {message.text && <p>{message.text}</p>}
                      <span
                        className={`text-[10px] ${
                          message.senderId === authUser._id ? "text-primary-content/70 self-end" : "text-base-content/70"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>

                    <div
                      className={`dropdown absolute hidden group-hover:block top-0 ${
                        message.senderId === authUser._id ? "dropdown-left dropdown-start right-0" : "dropdown-right left-0"
                      }`}
                    >
                      <div
                        tabIndex={0}
                        role="button"
                        className="dropBtn bg-base-200/80 text-base-content rounded-full p-1"
                      >
                        <IoIosArrowDown />
                      </div>

                      <ul tabIndex={0} className="dropdown-content menu bg-base-200 text-base-content rounded-lg z-[1] w-52 p-1 shadow">
                        {message.text && (
                          <li onClick={() => copyMessage(message.text)}>
                            <a>
                              <FaCopy className="text-lg" />
                              Copy Message
                            </a>
                          </li>
                        )}

                        <li onClick={() => handleDeleteMessage(message)}>
                          <a>
                            <MdDelete className="text-lg" />
                            {message.senderId === authUser._id
                              ? !isMessageDeleting
                                ? "Unsend Message"
                                : "Unsending..."
                              : "Remove Message"}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <GroupMessageInput />
    </article>
  );
};

export default GroupChatContainer;

