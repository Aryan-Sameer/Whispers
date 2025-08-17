import React from "react";
import { FaLock } from "react-icons/fa";

const NoChatSelected = () => {
  return (
    <div className="hidden sm:flex flex-1 flex-col items-center justify-center select-none mx-4 sm:mx-0">
      <div className="max-w-md text-center space-y-4 bg-base-200/50 rounded-md py-8 px-4">
        <div className="flex justify-center items-center flex-col sm:flex-row gap-4 mb-4">
          <img className="w-24 sm:w-20" src="./whispersLogo.png" alt="" />
          <h2 className="text-2xl font-bold">Welcome to Whispers!</h2>
        </div>

        <p className="text-base-content/70">
          A secure way to connect with your family and friends to whisper your stories
        </p>
      </div>

      <footer className="mt-auto text-center absolute bottom-6 mx-6 flex flex-col items-center gap-2">
        <span className="text-sm">Whispers v2.0.0</span>
        <span className="flex items-center gap-2 text-sm"><FaLock /> Secure Data Transfer</span>
      </footer>
    </div >
  );
};

export default NoChatSelected;
