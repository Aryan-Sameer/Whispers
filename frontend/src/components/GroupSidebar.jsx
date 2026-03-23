import { useEffect, useState } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

import { getLetters } from "../lib/utils.js";

import { HiUsers } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";

const GroupSidebar = () => {
  const { authUser, onlineUsers } = useAuthStore();
  const {
    groups,
    selectedGroup,
    getMyGroups,
    isGroupsLoading,
    createGroup,
    setSelectedGroup,
  } = useGroupChatStore();

  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getMyGroups();
  }, [getMyGroups]);

  const handleCreate = async () => {
    const name = groupName.trim();
    if (!name) return;
    const created = await createGroup({ name });
    if (created) setGroupName("");
  };

  const isGroupOnline = (group) => {
    if (!group?.members?.length) return false;
    return group.members.some((m) => {
      const id = m.userId?._id ?? m.userId;
      return id && onlineUsers.includes(id.toString());
    });
  };

  if (isGroupsLoading) {
    return (
      <aside className="h-full lg:w-80 md:w-60 border-r border-base-300 flex flex-col">
        <div className="p-4">Loading groups...</div>
      </aside>
    );
  }

  return (
    <aside className="h-full lg:w-80 md:w-60 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="chatList overflow-y-auto w-full">
        <div className="max-md:w-max w-full p-3 select-none">
          <div className="flex items-center gap-2">
            <HiUsers className="text-2xl md:m-0" />
            <span className="font-medium text-2xl">Group Chats</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="New group name"
              className="input input-sm input-bordered rounded-full w-full"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={handleCreate}
              disabled={!groupName.trim()}
              aria-label="Create group"
            >
              <IoMdAdd />
            </button>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="text-center text-zinc-500 py-4 select-none">
            {authUser ? "No groups yet. Create one above." : "Please login."}
          </div>
        ) : (
          groups.map((group, idx) => (
            <button
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                ${idx % 2 === 0 ? "max-md:bg-base-100" : ""}`}
            >
              <div className="relative flex items-center justify-center bg-primary min-w-10 min-h-10 sm:min-w-12 sm:min-h-12 text-primary-content rounded-full">
                <span className="text-lg">{getLetters(group.name)}</span>
                {isGroupOnline(group) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-1 ring-green-700" />
                )}
              </div>

              <div className="block text-left min-w-0">
                <div className="font-medium truncate">{group.name}</div>
                <div className="text-sm text-zinc-400">
                  {group.members?.length ? `${group.members.length} members` : "Members"}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <span className="mt-auto mx-3 my-1">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Aryan-Sameer/Whispers.git"
          className="text-sm hover:text-blue-600 hover:underline"
        >
          Learn More
        </a>
      </span>
    </aside>
  );
};

export default GroupSidebar;

