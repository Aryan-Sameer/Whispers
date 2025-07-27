import React from 'react';
import { useChatStore } from '../store/useChatStore.js';
import SideBar from '../components/SideBar.jsx';
import NoChatSelected from "../components/NoChatSelected.jsx"
import Chatcontainer from "../components/ChatContainer.jsx"

const HomePage = () => {

  const { selectedUser } = useChatStore();

  return (
    <main className="main flex flex-grow h-full">

      <section className={`bg-base-200/50 ${!selectedUser? "max-sm:w-full" : "max-sm:w-0"}`}>
        <SideBar />
      </section>

      <section className={`w-full flex justify-center items-center ${selectedUser? "max-sm:w-full" : "max-sm:w-0"}`}>
        {!selectedUser ? <NoChatSelected /> : <Chatcontainer />}
      </section>

    </main>
  );
};

export default HomePage;
