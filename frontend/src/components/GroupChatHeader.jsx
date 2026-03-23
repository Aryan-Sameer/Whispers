import { useEffect, useMemo, useState } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useFriendsStore } from "../store/useFriendsStore.js";

import { getLetters } from "../lib/utils.js";
import { IoMdClose } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";

const GroupChatHeader = () => {
  const { selectedGroup, setSelectedGroup, exitGroup, addMember } = useGroupChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const { users, getUsers, isUsersLoading } = useFriendsStore();

  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const isAdmin = useMemo(() => {
    if (!selectedGroup || !authUser) return false;
    const adminId = selectedGroup.adminId?._id ?? selectedGroup.adminId;
    return adminId?.toString() === authUser._id?.toString();
  }, [selectedGroup, authUser]);

  const memberIds = useMemo(() => {
    return new Set(
      (selectedGroup?.members ?? [])
        .map((m) => m.userId?._id ?? m.userId)
        .filter(Boolean)
        .map((id) => id.toString())
    );
  }, [selectedGroup]);

  const eligibleFriends = useMemo(() => {
    return (users ?? [])
      .filter((u) => u?._id && u._id.toString() !== authUser?._id?.toString())
      .filter((u) => !memberIds.has(u._id.toString()));
  }, [users, authUser, memberIds]);

  const groupOnline = useMemo(() => {
    return (selectedGroup?.members ?? []).some((m) => {
      const id = m.userId?._id ?? m.userId;
      return id && onlineUsers.includes(id.toString());
    });
  }, [selectedGroup, onlineUsers]);

  const handleAdd = async (friendId) => {
    if (!selectedGroup) return;
    await addMember(selectedGroup._id, friendId);
    setIsAddOpen(false);
  };

  if (!selectedGroup) return null;

  return (
    <div className="p-2.5 border-b border-base-300 bg-base-200/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="profilePic">
            <div className="relative mx-auto lg:mx-0 flex items-center justify-center bg-primary size-10 sm:size-12 text-primary-content rounded-full">
              <span className="text-lg">{getLetters(selectedGroup.name)}</span>
            </div>
          </div>

          <div>
            <div className="font-medium flex items-center gap-2">
              {selectedGroup.name}
              {isAdmin && <span className="badge badge-success badge-sm">Admin</span>}
            </div>
            <p className="text-sm text-base-content/70">
              {groupOnline ? "Active now" : "No one online"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="dropdown dropdown-end z-10">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setIsAddOpen((v) => !v)}
              >
                <IoPersonAdd />
                <span className="hidden sm:inline">Add</span>
              </button>

              <ul
                tabIndex={0}
                className={`dropdown-content menu bg-base-300 z-[1] w-72 p-2 shadow rounded-md ${
                  isAddOpen ? "block" : "hidden"
                }`}
              >
                <li className="select-none opacity-80" style={{ cursor: "default" }}>
                  {isUsersLoading ? "Loading friends..." : "Add your friend to this group"}
                </li>
                <div className="divider my-1" />
                {eligibleFriends.length === 0 ? (
                  <li className="select-none opacity-80" style={{ cursor: "default" }}>
                    No eligible friends
                  </li>
                ) : (
                  eligibleFriends.slice(0, 10).map((friend) => (
                    <li key={friend._id}>
                      <button
                        className="w-full text-left"
                        onClick={() => handleAdd(friend._id)}
                        type="button"
                      >
                        {friend.fullName}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
            onClick={() => exitGroup(selectedGroup._id)}
          >
            Exit
          </button>

          <button
            onClick={() => setSelectedGroup(null)}
            className="bg-base-200 rounded-full p-1 m-1"
            type="button"
            aria-label="Close chat"
          >
            <IoMdClose className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatHeader;

