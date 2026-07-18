import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [authUser, setAuthUser] = useAuth();

  const email = location.state?.email|| localStorage.getItem("verifyEmail");
  

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`http://localhost:3001/api/users/verify-otp`, { email, otp });

      localStorage.setItem("ChatAppUser", JSON.stringify(res.data.user));
      setAuthUser(res.data.user);
      localStorage.removeItem("verifyEmail");

      alert("Email verified successfully 🎉");
      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response?.data?.message || "Invalid OTP");
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleVerify}
        className="border border-white px-6 py-4 rounded-md space-y-4 w-96"
      >
        <h2 className="text-xl text-blue-400 font-bold text-center">
          Verify OTP
        </h2>
        <p className="text-white text-sm text-center">
          Enter OTP sent to {" "}<span className="text-green-400">{email}</span>
        </p>
     
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          autoFocus
          className="w-full px-3 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:border-green-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-1 rounded"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <p className="text-white text-sm text-center">
          Didn't receive OTP?{" "}
          <span
            className="text-blue-400 cursor-pointer underline"
            onClick={() => navigate("/signup")}
          >
            Try again
          </span>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;
