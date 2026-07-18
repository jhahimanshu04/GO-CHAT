
import React, { useState } from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import toast, { Toaster } from 'react-hot-toast';

function Logout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const [ authUser ,setAuthUser] = useAuth(); 

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);
    try {
  await axios.post("/api/users/logout", {}, { withCredentials: true });

      // ✅ SAME key jo login me use ho rahi hai
      localStorage.removeItem("ChatApp");
      Cookies.remove("jwt");
       setAuthUser(null);
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.log("Error in Logout", error);
    } finally {
      setLoading(false);
    }
  };

  {/* Logout Button */ }
  return(
<div
  onClick={handleLogout}
  className="bg-gray-800 flex items-center gap-2 p-2 rounded-full shadow-md hover:bg-gray-700 cursor-pointer m-1"
>
  <RiLogoutCircleLine className="text-2xl text-white" />
  <p className="text-md text-white">
    {loading ? "Logging out..." : "Logout"}
  </p>
    </div>
  )

}

export default Logout;


