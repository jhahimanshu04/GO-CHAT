import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthProvider";
import toast, { Toaster } from 'react-hot-toast';
// import { useAuth } from "../context/AuthProvider";

const Signup = () => {
   const [authUser, setAuthUser] = useAuth('');
  const navigate = useNavigate();
  // console.log("Current Auth User:", authUser);
 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data); // Debugging check

    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,

      // confirmPassword frontend pe check ho chuka hai, backend ko bhejne ki zaroorat nahi
    };

// const BASE_URL = import.meta.env.VITE_API_URL;
// console.log("BASE_URL:", BASE_URL);

    await axios
      .post("http://localhost:3001/api/users/signup", userInfo, {
           withCredentials: true,
      })
       
      // .then((response) => {
      //   console.log("Response:", response.data);
      //   if (response.data) {
      //     localStorage.setItem("ChatAppUser", JSON.stringify(response.data)); // 
      //     setAuthUser(response.data); 
      //     toast.success("User Successfully created....Proceed to Login");
      //      navigate("/login");
      //      navigate("/verify-otp", { state: { email: data.email } });
      //   }
      .then((response) => {
  console.log("Response:", response.data);

  if (response.data) {
    toast.success("OTP Sent Successfully");

    navigate("/verify-otp", {
      state: { email: data.email },
    });
  }
       
     
      })
      .catch((error) => {
        if (error.response) {
          console.log("Error Response:", error.response.data); // ✅ Debug
          toast.error("Error: " + error.response.data.message);
          console.log("Full Error:", error.response.data);
        } else {
          console.log("Axios Error:", error);
        }
      });
  };





  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-white px-6 py-2 rounded-md space-y-3 w-96"
      >
        <h1 className="text-2xl text-center text-white">
          Go<span className="text-green-500 font-semibold">Chat</span>
        </h1>

        <h2 className="text-xl text-blue-400 font-bold">Signup</h2>
        <br />

        {/* Fullname */}
        <label className="input validator">
          <input
            type="text"
            placeholder="Fullname"
            {...register("fullname", {
              required: "Fullname is required",
              pattern: {
                value: /^[A-Za-z\s][A-Za-z0-9\s-]*$/,
                message: "Only letters, numbers, dash, and spaces allowed",
              },
              minLength: { value: 3, message: "Minimum 3 characters" },
              maxLength: { value: 30, message: "Maximum 30 characters" },
            })}
          />
        </label>
        {errors.fullname && (
          <span className="text-red-500 text-sm">
            {errors.fullname.message}
          </span>
        )}

        {/* Email */}
        <label className="input validator">
          <input
            type="email"
            placeholder="mail@site.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
        </label>
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}

        {/* Password */}
        <label className="input validator">
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                message:
                  "Must include uppercase, lowercase, number and be 8+ chars",
              },
            })}
          />
        </label>
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}

        {/* Confirm Password */}
        <label className="input validator">
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
        </label>
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </span>
        )}

        {/* Text & Button */}
        <div className="flex justify-between">
          <p className="text-white">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-green-400 underline cursor-pointer ml-1"
            >
              Login
            </Link>
          </p>
          <input
            className="text-white bg-blue-400 px-2 py-1 rounded-lg cursor-pointer"
            type="submit"
            value="Signup"
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
