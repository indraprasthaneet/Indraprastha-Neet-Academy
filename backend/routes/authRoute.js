import express from "express"
import {googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyOtp, checkAuth, requestSignupOtp, verifySignupOtp } from "../controllers/authController.js"
import isAuth from "../middlewares/isAuth.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.get("/logout", logOut)
authRouter.post("/googlesignup", googleSignup)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyotp", verifyOtp)
authRouter.post("/resetpassword", resetPassword)
authRouter.post("/request-signup-otp", requestSignupOtp)
authRouter.post("/verify-signup-otp", verifySignupOtp)
authRouter.get("/check", isAuth, checkAuth)

export default authRouter
