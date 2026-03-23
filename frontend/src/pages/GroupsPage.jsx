import { useGroupChatStore } from "../store/useGroupChatStore.js";
import GroupSidebar from "../components/GroupSidebar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import GroupChatContainer from "../components/GroupChatContainer.jsx";

const GroupsPage = () => {
  const { selectedGroup } = useGroupChatStore();

  return (
    <main className="main flex flex-grow h-full">
      <section className={`bg-base-200/50 ${!selectedGroup ? "max-sm:w-full" : "max-sm:w-0"}`}>
        <GroupSidebar />
      </section>

      <section className={`w-full flex justify-center items-center ${selectedGroup ? "max-sm:w-full" : "max-sm:w-0"}`}>
        {!selectedGroup ? <NoChatSelected /> : <GroupChatContainer />}
      </section>
    </main>
  );
};

export default GroupsPage;

