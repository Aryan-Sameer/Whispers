import { useEffect, useRef, useState } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore.js";
import { FaImage } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import toast from "react-hot-toast";

const GroupMessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendGroupMessage, isSendingMessage, selectedGroup } = useGroupChatStore();

  useEffect(() => {
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [selectedGroup?._id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader(file);
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;

    await sendGroupMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current?.value) fileInputRef.current.value = "";
  };

  return (
    <div className="mt-auto m-2">
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

      <form onSubmit={handleSend} className="flex items-center gap-1 sm:gap-2">
        <div className="flex-1 flex gap-1 sm:gap-2 relative">
          <button
            type="button"
            className={`btn border-none px-4 ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSendingMessage}
          >
            <FaImage />
          </button>

          <input
            type="text"
            disabled={isSendingMessage}
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
        </div>

        <button
          type="submit"
          className="btn btn-primary border-none px-2 sm:px-4"
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}
        >
          {!isSendingMessage ? <IoIosSend className="size-8" /> : <span className="loading loading-spinner loading-md" />}
        </button>
      </form>
    </div>
  );
};

export default GroupMessageInput;

