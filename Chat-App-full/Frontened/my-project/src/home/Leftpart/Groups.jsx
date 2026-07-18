import React, { useState } from "react";
import useGetGroups from "../../context/useGetGroups.js";
import useConversation from "../../zustand/useConversation.js";
import useGetAllUsers from "../../context/useGetAllUsers.jsx";
import axios from "axios";
import { MdGroupAdd, MdClose } from "react-icons/md";

function Groups() {
  const [groups, loading, fetchGroups] = useGetGroups();
  const { selectedGroup, setSelectedGroup, setSelectedConversation } = useConversation();
  const [allUsers] = useGetAllUsers();
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creating, setCreating] = useState(false);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    try {
      setCreating(true);
      await axios.post(
        "http://localhost:3001/api/group/create",
        { name: groupName, description: groupDesc, memberIds: selectedMembers },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setGroupName("");
      setGroupDesc("");
      setSelectedMembers([]);
      setShowCreate(false);
      fetchGroups();
    } catch (err) {
      console.error("Error creating group:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 sticky top-0 z-10">
        <h1 className="text-white font-semibold">Groups</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="text-green-400 hover:text-green-300"
          title="Create Group"
        >
          <MdGroupAdd className="text-2xl" />
        </button>
      </div>

      {/* Group list */}
      <div>
        {loading && <p className="text-center text-gray-400 py-4">Loading...</p>}
        {!loading && groups.length === 0 && (
          <p className="text-center text-gray-500 py-4 text-sm">No groups yet</p>
        )}
        {groups.map((group) => (
          <div
            key={group._id}
            onClick={() => {
              setSelectedGroup(group);
              setSelectedConversation(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-700 duration-300 ${
              selectedGroup?._id === group._id ? "bg-slate-700" : ""
            }`}
          >
            {/* Group avatar */}
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-semibold">{group.name}</h2>
              <p className="text-gray-400 text-xs">{group.members.length} members</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">Create Group</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white">
                <MdClose className="text-2xl" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Group name *"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-bordered w-full bg-slate-700 text-white"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              className="input input-bordered w-full bg-slate-700 text-white"
            />

            <div>
              <p className="text-gray-400 text-sm mb-2">Add members:</p>
              <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
                {allUsers.map((user) => (
                  <label key={user._id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-success"
                      checked={selectedMembers.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                    />
                    <span className="text-white">{user.fullname}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || creating}
              className="btn btn-success w-full disabled:opacity-50"
            >
              {creating ? <span className="loading loading-spinner" /> : "Create Group"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
