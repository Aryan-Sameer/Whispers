import React from "react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center select-none mx-4 sm:mx-0">
      <div className="max-w-md text-center space-y-4 bg-base-200/50 rounded-md py-8 px-4">
        <div className="flex justify-center items-center gap-4 mb-4">
          <img className="w-24 sm:w-20" src="./whispersLogo.png" alt="" />
          <h2 className="text-2xl font-bold">Welcome to Whispers!</h2>
        </div>

        <p className="text-base-content/70">
          Your personal space for secure and private conversations.
        </p>
      </div>

      <div className="update mt-auto text-center absolute bottom-6 mx-6">
        <p className="m-0 text-md text-base-content/40">Update!</p>
        <p className="text-base-content/40 text-sm">
          You can now copy and delete the message on clicking the drop down option on messages
        </p>
        <p className="text-base-content/40 text-sm">
          You can also now chat with your self.
        </p>
      </div>
    </div >
  );
};

export default NoChatSelected;
