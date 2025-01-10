import React from "react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center select-none mx-2 sm:mx-0">
      <div className="max-w-md text-center space-y-4 bg-base-200/50 rounded-md p-8">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative w-20">
            <img src="./whispersLogo.png" alt="" />
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to Whispers!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div >
  );
};

export default NoChatSelected;
