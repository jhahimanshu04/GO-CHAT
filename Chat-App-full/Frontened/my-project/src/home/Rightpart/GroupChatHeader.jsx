import React, { useState } from "react";
import useConversation from "../../zustand/useConversation.js";
import useGetAllUsers from "../../context/useGetAllUsers.jsx";
import { CiMenuFries } from "react-icons/ci";
import { MdPersonAdd, MdExitToApp, MdClose } from "react-icons/md";
import axios from "axios";

function GroupChatHeader({ onLeave }) {
  const { selectedGroup, setSelectedGroup } = useConversation();
  const [allUsers] = useGetAllUsers();
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [adding, setAdding] = useState(false);

  const authUser = JSON.parse(localStorage.getItem("ChatAppUser"));
  const isAdmin = String(selectedGroup?.admin) === String(authUser?._id);

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      setAdding(true);
      await axios.post(
        `http://localhost:3001/api/group/add-member/${selectedGroup._id}`,
        { userId: selectedUser },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShowAddMember(false);
      setSelectedUser("");
    } catch (err) {
      console.error("Error adding member:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Leave this group?")) return;
    try {
      await axios.post(
        `http://localhost:3001/api/group/leave/${selectedGroup._id}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSelectedGroup(null);
      if (onLeave) onLeave();
    } catch (err) {
      console.error("Error leaving group:", err);
    }
  };

  const memberNames = selectedGroup?.members?.map((m) => m.fullname || m).join(", ");

  return (
    <>
      <div className="relative flex items-center h-[8vh] bg-gray-800 px-4 rounded-md gap-3">
        <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button lg:hidden">
          <CiMenuFries className="text-white text-3xl" />
        </label>

        {/* Group avatar */}
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {selectedGroup?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-white text-lg font-semibold truncate">{selectedGroup?.name}</h1>
          <p className="text-gray-400 text-xs truncate">{selectedGroup?.members?.length} members</p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(true)}
              className="text-gray-300 hover:text-green-400"
              title="Add member"
            >
              <MdPersonAdd className="text-2xl" />
            </button>
          )}
          <button onClick={handleLeave} className="text-gray-300 hover:text-red-400" title="Leave group">
            <MdExitToApp className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Add Member</h2>
              <button onClick={() => setShowAddMember(false)} className="text-gray-400 hover:text-white">
                <MdClose className="text-xl" />
              </button>
            </div>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="select select-bordered w-full bg-slate-700 text-white"
            >
              <option value="">Select a user</option>
              {allUsers
                .filter((u) => !selectedGroup?.members?.map((m) => String(m._id || m)).includes(String(u._id)))
                .map((u) => (
                  <option key={u._id} value={u._id}>{u.fullname}</option>
                ))}
            </select>
            <button
              onClick={handleAddMember}
              disabled={!selectedUser || adding}
              className="btn btn-success w-full disabled:opacity-50"
            >
              {adding ? <span className="loading loading-spinner" /> : "Add"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupChatHeader;
