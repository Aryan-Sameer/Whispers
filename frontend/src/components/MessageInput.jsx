import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { FaImage } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import toast from 'react-hot-toast';

const MessageInput = () => {

  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const { sendMessage, isSendingMessage, selectedUser } = useChatStore();

  useEffect(() => {
    setText("")
  }, [selectedUser])

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image")
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader(file);
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(
        {
          text: text.trim(),
          image: imagePreview
        }
      );

      setText("");
      setImagePreview(null)
      if (fileInputRef.current.value) fileInputRef.current.value = "";

    } catch (error) {
      console.log('Failed to send the message', error)
    }
  }

  return (
    <div className='mt-auto m-2'>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              X
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
        <div className="flex-1 flex gap-1 sm:gap-2 relative">
          <input
            type="text"
            disabled = {isSendingMessage}
            className="w-full input input-bordered rounded-lg max-sm:p-2 md:p-3 input-md focus-within:outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn border-none px-4 ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}>
            <FaImage />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-primary border-none px-2 sm:px-4"
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}>
          {!isSendingMessage ? <IoIosSend className='size-8' /> :
            <span className="loading loading-spinner loading-md"></span>}
        </button>
      </form>
    </div>
  )
}

export default MessageInput
