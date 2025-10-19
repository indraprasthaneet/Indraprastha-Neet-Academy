import mongoose from "mongoose";

const signupOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  inviteCode: { type: String },
  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true }
}, { timestamps: true });

const SignupOtp = mongoose.model("SignupOtp", signupOtpSchema);
export default SignupOtp;
