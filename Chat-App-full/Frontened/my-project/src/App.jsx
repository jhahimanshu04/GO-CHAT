import React from "react";
import Left from "./home/Leftpart/Left.jsx";
import Right from "./home/Rightpart/Right.jsx";
import "./index.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Loading from "./components/Loading";
import toast, { Toaster } from 'react-hot-toast';


import { useAuth } from "./context/AuthProvider";
import { Route, Routes, Navigate } from "react-router-dom";
 import VerifyOtp from "./components/Verify-otp";

 import axios from "axios";

axios.defaults.withCredentials = true; 

function App() {
  const [authUser, setAuthUser,loading] = useAuth();
  console.log(authUser, setAuthUser);
   if (loading) return <Loading />;

  return (
    <>
      <Routes>
        {/* Protected Homepage */}
        <Route
          path="/"
          element={
            authUser ? (
             
              <div className="drawer lg:drawer-open  h-screen overflow-auto no-scrollbar">
                <input
                  id="my-drawer-2"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content flex h-screen overflow-hidden">
                  <Right />
                </div>
                <div className="drawer-side no-scrollbar">
                  <label
                    htmlFor="my-drawer-2"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <ul className="menu w-80 min-h-full  bg-black text-base-content">
                    <Left />
                  </ul>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        
        {/* Login */}
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <Login />}
        />
        {/* Signup */}
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Routes>
          <Toaster />
       
    </>
      
        
    
     
    
  );
}

export default App;


