import SignupOtp from "../models/signupOtpModel.js"
import { genToken } from "../configs/token.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import sendMail from "../configs/Mail.js"

// Define SECURE, CROSS-SITE cookie options once
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,   // 🚀 FIX 1: MUST be true for cross-site (Samesite=None) and for HTTPS (Render/Vercel)
    sameSite: "None", // 🚀 FIX 2: MUST be "None" to allow Vercel domain to send cookie to Render domain
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// =====================================================================================================================
// Request OTP for signup
export const requestSignupOtp = async (req, res) => {
    try {
        let { name, email, password, role, inviteCode } = req.body;
        // NOTE: User model needs to be imported or available here. Assuming it is.

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
        // ... (educator invite code logic remains the same) ...

        await SignupOtp.deleteMany({ email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000;

        const hashPassword = await bcrypt.hash(password, 10);
        await SignupOtp.create({ name, email, password: hashPassword, role, inviteCode, otp, otpExpires });
        await sendMail(email, otp);

        return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.log("requestSignupOtp error", error);
        return res.status(500).json({ message: `Signup OTP Error: ${error.message}` });
    }
};

// =====================================================================================================================
// Verify OTP and create user
export const verifySignupOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpDoc = await SignupOtp.findOne({ email });
        
        if (!otpDoc || otpDoc.otp !== otp || otpDoc.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        
        let user = await User.create({
            name: otpDoc.name,
            email: otpDoc.email,
            password: otpDoc.password,
            role: otpDoc.role,
            ...(otpDoc.inviteCode ? { inviteCode: otpDoc.inviteCode } : {})
        });
        
        let token = await genToken(user._id, user.role);

        // ✅ FIX APPLIED HERE
        res.cookie("token", token, COOKIE_OPTIONS); 

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
        return res.status(500).json({ message: `Verify Signup OTP Error: ${error.message}` });
    }
};

// =====================================================================================================================
// Standard Sign Up (Non-OTP)
export const signUp = async (req, res) => {
    try {
        let { name, email, password, role, inviteCode } = req.body
        // ... (validation logic remains the same) ...
        
        // Ensure role is handled
        if (role === "educator") {
             const expectedInviteCode = process.env.TEACHER_SECRET_CODE
             if (inviteCode !== expectedInviteCode) {
                 return res.status(403).json({ message: "Not authorized to signup as teacher" })
             }
        }
        
        let hashPassword = await bcrypt.hash(password, 10)
        let user = await User.create({ name, email, password: hashPassword, role });
        
        let token = await genToken(user._id, user.role);
        
        // ✅ FIX APPLIED HERE
        res.cookie("token", token, COOKIE_OPTIONS); 
        
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: user.photoUrl
        })
    } catch (error) {
        console.log("signUp error", error);
        return res.status(500).json({ message: `signUp Error ${error.message}` })
    }
}

// =====================================================================================================================
// Standard Login
export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials or use Google login." });
        }
        
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        
        let token = await genToken(user._id, user.role);

        // ✅ FIX APPLIED HERE
        res.cookie("token", token, COOKIE_OPTIONS);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            photoUrl: user.photoUrl
        });
    } catch (error) {
        console.log("login error", error);
        return res.status(500).json({ message: `login Error ${error.message}` });
    }
}

// =====================================================================================================================
// Log Out
export const logOut = async (req, res) => {
    try {
        // Clearing a cross-site cookie requires the same options
        res.clearCookie("token", COOKIE_OPTIONS);
        return res.status(200).json({ message: "logOut Successfully" });
    } catch (error) {
        return res.status(500).json({ message: `logout Error ${error.message}` });
    }
}

// =====================================================================================================================
// Google Signup/Login
export const googleSignup = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up first." });
        }

        const token = await genToken(user._id, user.role);

        // ✅ FIX APPLIED HERE
        res.cookie("token", token, COOKIE_OPTIONS);

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

// ... (sendOtp, checkAuth, verifyOtp, resetPassword functions remain the same as they don't set cookies) ...
