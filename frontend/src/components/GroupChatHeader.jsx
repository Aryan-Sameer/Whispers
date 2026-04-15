import { useEffect, useMemo, useState } from "react";
import { useGroupChatStore } from "../store/useGroupChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { useFriendsStore } from "../store/useFriendsStore.js";

import { getLetters } from "../lib/utils.js";
import { IoMdClose } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";

const GroupChatHeader = () => {
  const { selectedGroup, setSelectedGroup, exitGroup, addMember, removeMember } = useGroupChatStore();
  const { authUser } = useAuthStore();
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

  const handleAdd = async (friendId) => {
    if (!selectedGroup) return;
    await addMember(selectedGroup._id, friendId);
    setIsAddOpen(false);
  };

  const handleRemoveMember = async (memberId) => {
    if (!selectedGroup) return;
    await removeMember(selectedGroup._id, memberId);
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
            </div>
            <button
              type="button"
              className="text-sm text-base-content/70 hover:underline"
              onClick={() => document.getElementById("group_info_modal").showModal()}
            >
              click to see group info
            </button>
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
                className={`dropdown-content menu bg-base-300 z-[1] w-72 p-2 shadow rounded-md ${isAddOpen ? "block" : "hidden"
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
            onClick={() => setSelectedGroup(null)}
            className="bg-base-200 rounded-full p-1 m-1"
            type="button"
            aria-label="Close chat"
          >
            <IoMdClose className="size-6" />
          </button>
        </div>
      </div>

      <dialog id="group_info_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-lg">
          <h3 className="font-semibold text-lg">{selectedGroup.name}</h3>
          <p className="text-sm opacity-70 mb-3">{selectedGroup.members?.length || 0} members</p>

          <div className="max-h-72 overflow-y-auto space-y-2">
            {(selectedGroup.members ?? []).map((member) => {
              const memberUser = member.userId;
              const memberId = memberUser?._id ?? memberUser;
              const memberName = memberUser?.fullName || "Member";
              const isSelf = memberId?.toString() === authUser?._id?.toString();
              const isMemberAdmin = member.role === "admin";

              return (
                <div key={memberId} className="flex items-center justify-between bg-base-300 rounded-md p-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center overflow-hidden">
                      {memberUser?.profilePicture ? (
                        <img src={memberUser.profilePicture} alt={memberName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{getLetters(memberName)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {memberName} {isSelf ? "(You)" : ""}
                      </p>
                      <p className="text-xs opacity-70">{isMemberAdmin ? "Admin" : "Member"}</p>
                    </div>
                  </div>

                  {isAdmin && !isSelf && !isMemberAdmin && (
                    <button
                      type="button"
                      className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
                      onClick={() => handleRemoveMember(memberId.toString())}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={() => exitGroup(selectedGroup._id)}
            >
              Exit Group
            </button>

            <form method="dialog">
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default GroupChatHeader;

