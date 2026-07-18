import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true);

         const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:3001/api/users/AllUsers`, {
          withCredentials: true,
        headers: {
              Authorization: `Bearer ${token}`, 
            }
  },
        );

        setAllUsers(res.data);
      } catch (error) {
        console.error("Error in useGetAllUsers:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  return [allUsers, loading];
}

export default useGetAllUsers;
