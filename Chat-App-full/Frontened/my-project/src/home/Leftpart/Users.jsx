
import React from "react";
import "../../index.css";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";

function Users() {
  const [AllUsers, loading] = useGetAllUsers();
  console.log(AllUsers);
  console.log(loading);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <h1 className="px-8 py-2 text-white font-semibold bg-slate-800 sticky top-0 z-10">
        My Contacts
      </h1>

      <div
        className="py-2 flex-1 overflow-y-auto no-scrollbar "
        style={{ maxHeight: "calc(82vh - 10vh)" }}
      >
        

        {AllUsers &&
          AllUsers.map((user) => <User key={user._id} user={user} />)}
      </div>
    </div>
  );
}

export default Users;
