import SignupOtp from "../models/signupOtpModel.js"
// Request OTP for signup
export const requestSignupOtp = async (req, res) => {
    try {
        let { name, email, password, role, inviteCode } = req.body;
        let existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter valid Email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Please enter a Strong Password" });
        }
        // Check educator invite code
        if (role === "educator") {
            const expectedInviteCode = process.env.TEACHER_SECRET_CODE;
            if (!expectedInviteCode) {
                return res.status(500).json({ message: "Teacher signup is not properly configured" });
            }
            if (inviteCode !== expectedInviteCode) {
                return res.status(403).json({ message: "Not authorized to signup as teacher" });
            }
        }
        // Remove any previous OTP for this email
        await SignupOtp.deleteMany({ email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000;
        // Hash password before storing
        const hashPassword = await bcrypt.hash(password, 10);
        await SignupOtp.create({ name, email, password: hashPassword, role, inviteCode, otp, otpExpires });
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.log("requestSignupOtp error", error);
        return res.status(500).json({ message: `Signup OTP Error: ${error}` });
    }
};

// Verify OTP and create user
export const verifySignupOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpDoc = await SignupOtp.findOne({ email });
        if (!otpDoc || otpDoc.otp !== otp || otpDoc.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        // Create user
        let user = await User.create({
            name: otpDoc.name,
            email: otpDoc.email,
            password: otpDoc.password,
            role: otpDoc.role,
            ...(otpDoc.inviteCode ? { inviteCode: otpDoc.inviteCode } : {})
        });
        let token = await genToken(user._id, user.role);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // Remove OTP doc
        await SignupOtp.deleteOne({ email });
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: user.photoUrl
        });
    } catch (error) {
        console.log("verifySignupOtp error", error);
        return res.status(500).json({ message: `Verify Signup OTP Error: ${error}` });
    }
};

import { genToken } from "../configs/token.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import sendMail from "../configs/Mail.js"

// Define secure, cross-site cookie options for all functions
const cookieOptions = {
    httpOnly: true,
    secure: true,   // ✅ FIX: Must be true because Vercel frontend is HTTPS
    sameSite: "None", // ✅ FIX: Must be "None" to allow cross-site cookie sending (Vercel to API)
    maxAge: 7 * 24 * 60 * 60 * 1000
};

// ---------------------------------------------------------------------------------------------------------------------

export const signUp = async (req, res) => {
    try {
        let { name, email, password, role, inviteCode } = req.body
        let existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "email already exist" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter valid Email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Please enter a Strong Password" })
        }

        // Check if role is educator and validate invite code
        if (role === "educator") {
            const expectedInviteCode = process.env.TEACHER_SECRET_CODE
            if (!expectedInviteCode) {
                return res.status(500).json({ message: "Teacher signup is not properly configured" })
            }
            if (inviteCode !== expectedInviteCode) {
                return res.status(403).json({ message: "Not authorized to signup as teacher" })
            }
        }

        // Role validation and default
        const validRoles = ["student", "educator"]
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" })
        }
        if (!role) {
            role = "student"
        }

        let hashPassword = await bcrypt.hash(password, 10)
        let user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
        })
        
        let token = await genToken(user._id, user.role)
        
        // 🚀 UPDATED COOKIE OPTIONS
        res.cookie("token", token, cookieOptions); 
        
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: user.photoUrl
        })

    } catch (error) {
        console.log("signUp error")
        return res.status(500).json({ message: `signUp Error ${error}` })
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user does not exist" });
        }
        if (!user.password) {
            return res.status(400).json({ message: "This account was created with Google. Please use Google login." });
        }
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "incorrect Password" });
        }
        let token = await genToken(user._id, user.role);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: user.photoUrl
        });
    } catch (error) {
        console.log("login error", error);
        return res.status(500).json({ message: `login Error ${error}` });
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export const logOut = async (req, res) => {
    try {
        // Clearing cookie uses the default options, which is fine
        await res.clearCookie("token") 
        return res.status(200).json({ message: "logOut Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout Error ${error}` })
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export const googleSignup = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    
    // If user doesn't exist, return 404
    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Please sign up first." 
      });
    }

    // User exists - generate token and log them in
    const token = await genToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl
    });
  } catch (error) {
    console.error("Google auth error:", error.message);
    return res.status(500).json({ message: "Authentication failed" });
  }
};

// ---------------------------------------------------------------------------------------------------------------------

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp,
        user.otpExpires = Date.now() + 5 * 60 * 1000,
        user.isOtpVerifed = false

        await user.save()
        await sendMail(email, otp)
        return res.status(200).json({ message: "Email Successfully send" })
    } catch (error) {

        return res.status(500).json({ message: `send otp error ${error}` })
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export const checkAuth = async (req, res) => {
    try {
        // If the middleware passes, user is authenticated
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            // If token is valid but user is not found (e.g., deleted), return 404
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        return res.status(200).json({
            success: true,
            authenticated: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl
            }
        });
    } catch (error) {
        console.log("checkAuth error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication check failed",
            error: error.message
        });
    }
};

// ---------------------------------------------------------------------------------------------------------------------

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
        user.isOtpVerifed = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({ message: "OTP varified " })

    } catch (error) {
        return res.status(500).json({ message: `Varify otp error ${error}` })
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerifed) {
            return res.status(404).json({ message: "OTP verfication required" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword
        user.isOtpVerifed = false
        await user.save()
        return res.status(200).json({ message: "Password Reset Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Reset Password error ${error}` })
    }
}
