import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import createTokenAndSaveCookie from "../jwt/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getReceiverSocketId } from "../SocketIO/server.js";



export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: "Email already registered. Please login.",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      existingUser.fullname = fullname;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      existingUser.isVerified = false;

      await existingUser.save();
    } else {
      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false,
      });

      await newUser.save();
    }

    await sendEmail({
      to: email,
      subject: "Verify Email",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    return res.status(200).json({
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.log("Signup Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

  user.isVerified = true;
user.otp = undefined;
user.otpExpiry = undefined;

await user.save();

    createTokenAndSaveCookie(user._id, res);

    res.status(200).json({
      message: "Email verified successfully",
       
      user: { _id: user._id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};








export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ isVerified check pehle karo
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Cookie set karo
   const token = createTokenAndSaveCookie(user._id, res);

    res.status(200).json({
      message: "Login successful",
      token,
       
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};





  
    export const logout = async (req, res) => {
      try {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
        });
   
        res.status(201).json({ message: "Logout successful" });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
    };






    export const AllUsers = async (req, res) => {

      console.log(" AllUsers API HIT");
      try {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized - no user" });
        }

        const loggedInUser = req.user._id;

        console.log(loggedInUser);

        const filteredUsers = await User.find({
          _id: { $ne: loggedInUser },
        }).select("-password");
          
        console.log("✅ Backend se bhejne wale users:", filteredUsers);
       

        console.log(filteredUsers);
        res.status(200).json(filteredUsers);
      } catch (error) {
        console.log("Error in AllUsers Controller:", error);
        res.status(500).json({ message: "Server error" });
      }
    };


    
  

  
  