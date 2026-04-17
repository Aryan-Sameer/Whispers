import { useChatStore } from '../store/useChatStore.js';
import { useGroupChatStore } from '../store/useGroupChatStore.js';
import SideBar from '../components/SideBar.jsx';
import NoChatSelected from "../components/NoChatSelected.jsx"
import Chatcontainer from "../components/ChatContainer.jsx"
import GroupChatContainer from "../components/GroupChatContainer.jsx";

const HomePage = () => {

  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupChatStore();
  const hasSelection = Boolean(selectedUser || selectedGroup);

  return (
    <main className="flex flex-grow h-[calc(100svh-70px)]">

      <section className={`bg-base-200/50 ${!hasSelection ? "max-sm:w-full" : "max-sm:w-0"}`}>
        <SideBar />
      </section>

      <section className={`w-full flex justify-center items-center ${hasSelection ? "max-sm:w-full" : "max-sm:w-0"}`}>
        {!hasSelection ? <NoChatSelected /> : selectedGroup ? <GroupChatContainer /> : <Chatcontainer />}
      </section>

    </main>
  );
};

export default HomePage;
