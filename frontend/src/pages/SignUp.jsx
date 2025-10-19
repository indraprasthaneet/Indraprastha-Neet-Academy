import React, { useState } from 'react'
import google from '../assets/google.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import companylogo from "../assets/companylogo.jpg"
import { auth, provider } from '../utils/Firebase';


function SignUp() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("student");
    const [inviteCode, setInviteCode] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // Step 1: Request OTP
    const handleSignUp = async () => {
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }
            const signupData = {
                name: name + " " + lastName,
                email,
                password,
                role
            };
            if (role === "educator") {
                if (!inviteCode.trim()) {
                    toast.error("Invite code is required for educator signup");
                    setLoading(false);
                    return;
                }
                signupData.inviteCode = inviteCode;
            }
            await axios.post(serverUrl + "/api/auth/request-signup-otp", signupData, { withCredentials: true });
            setShowOtpInput(true);
            toast.success("OTP sent to your email");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const result = await axios.post(serverUrl + "/api/auth/verify-signup-otp", { email, otp }, { withCredentials: true });
            dispatch(setUserData(result.data));
            navigate("/");
            toast.success("SignUp Successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };
    
    const googleSignUp = async () => {
        try {
            const response = await signInWithPopup(auth, provider)
            let user = response.user
            let name = user.displayName;
            let email = user.email
            
            // For Google signup, we'll default to student role
            // Teachers should use the regular signup form with invite code
            const result = await axios.post(serverUrl + "/api/auth/googlesignup", {
                name,
                email,
                role: "student"
            }, { withCredentials: true })
            
            dispatch(setUserData(result.data))
            navigate("/")
            toast.success("SignUp Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Google signup failed")
        }
    }
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            {/* Changed fixed height to min-height and added responsive behavior */}
            <div className='w-full max-w-6xl min-h-[500px] sm:min-h-[600px] bg-white shadow-2xl rounded-3xl overflow-hidden'>
                <div className='flex flex-col lg:flex-row h-full'>
                    {/* Left Side - Hero Section */}
                    {/* Added responsive padding and made it scrollable on small screens */}
                    <div className='lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden'>
                        {/* Background Pattern */}
                        <div className='absolute inset-0 opacity-10'>
                            <div className='absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32'></div>
                            <div className='absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48'></div>
                            <div className='absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full'></div>
                        </div>
                        
                        {/* Content */}
                        <div className='relative z-10 text-center space-y-4'>
                            {/* Logo */}
                            <div className='mb-4'>
                                <img 
                                    src={companylogo} 
                                    className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full object-cover shadow-xl border-4 border-white/20' 
                                    alt="Company Logo" 
                                />
                            </div>
                            
                            {/* Title */}
                            <div className='space-y-3'>
                                <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold leading-tight'>
                                    Learning Management
                                    <br />
                                    <span className='text-yellow-300'>System</span>
                                </h1>
                                <p className='text-sm sm:text-base lg:text-lg text-blue-100 max-w-sm mx-auto leading-relaxed'>
                                    Your gateway to smarter learning
                                </p>
                            </div>
                            
                            {/* Motivational Message */}
                            <div className='pt-3'>
                                <div className='inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm'>
                                    <svg className='w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                                    </svg>
                                    <span className='font-medium'>Join us and start your journey today!</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Signup Form */}
                    {/* Added responsive padding and made it scrollable on small screens */}
                    <div className='lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center'>
                        <div className='max-w-md mx-auto w-full'>
                            {/* Header */}
                            <div className='text-center lg:text-left space-y-1 mb-4'>
                                <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>Sign Up</h2>
                                <p className='text-gray-600 text-sm sm:text-base'>Create your account and start learning</p>
                            </div>

                            {/* Form */}
                            {/* Adjusted spacing for better mobile experience */}
                            <form className='space-y-3 sm:space-y-4' onSubmit={(e) => e.preventDefault()}>
                                {/* Name Fields Row */}
                                {/* Changed to stack on mobile and use responsive grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <div>
                                        <label htmlFor="firstName" className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                                            First Name
                                        </label>
                                        <input
                                            id='firstName'
                                            type="text"
                                            className='w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base'
                                            placeholder='Enter first name'
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                                            Last Name
                                        </label>
                                        <input
                                            id='lastName'
                                            type="text"
                                            className='w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base'
                                            placeholder='Enter last name'
                                            onChange={(e) => setLastName(e.target.value)}
                                            value={lastName}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email and Username Row */}
                                {/* Changed to stack on mobile and use responsive grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <div>
                                        <label htmlFor="email" className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                                            Email Address
                                        </label>
                                        <input
                                            id='email'
                                            type="email"
                                            className='w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base'
                                            placeholder='Enter your email'
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="username" className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                                            Username
                                        </label>
                                        <input
                                            id='username'
                                            type="text"
                                            className='w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base'
                                            placeholder='Choose a username'
                                            onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Fields Row */}
                                {/* Changed to stack on mobile and use responsive grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    <div>
                                        <label htmlFor="password" className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                                            Password
                                        </label>
                                        <div className='relative'>
                                            <input
                                                id='password'
                                                type={show ? "text" : "password"}
                                                className='w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base'
                                                placeholder='Enter password'
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                required
                                            />
                                            <button
                                                type='button'
                                                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                                                onClick={() => setShow(prev => !prev)}
                                            >
                                                {show ? (
                                                    <MdRemoveRedEye className='w-4 h-4 sm:w-5 sm:h-5' />
                                                ) : (
                                                    <MdOutlineRemoveRedEye className='w-4 h-4 sm:w-5 sm:h-5' />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                                            Confirm Password
                                        </label>
                                        <div className='relative'>
                                            <input
                                                id='confirmPassword'
                                                type={showConfirm ? "text" : "password"}
                                                className='w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base'
                                                placeholder='Confirm password'
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                value={confirmPassword}
                                                required
                                            />
                                            <button
                                                type='button'
                                                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                                                onClick={() => setShowConfirm(prev => !prev)}
                                            >
                                                {showConfirm ? (
                                                    <MdRemoveRedEye className='w-4 h-4 sm:w-5 sm:h-5' />
                                                ) : (
                                                    <MdOutlineRemoveRedEye className='w-4 h-4 sm:w-5 sm:h-5' />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className='block text-xs sm:text-sm font-semibold text-gray-700 mb-2'>
                                        I am a
                                    </label>
                                    <div className='flex space-x-3'>
                                        <button
                                            type='button'
                                            className={`flex-1 py-2 sm:py-3 px-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm sm:text-base ${
                                                role === 'student' 
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                            onClick={() => setRole("student")}
                                        >
                                            Student
                                        </button>
                                        <button
                                            type='button'
                                            className={`flex-1 py-2 sm:py-3 px-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm sm:text-base ${
                                                role === 'educator' 
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                            onClick={() => setRole("educator")}
                                        >
                                            Educator
                                        </button>
                                    </div>
                                </div>

                                {/* Invite Code Field - only shown when educator is selected */}
                                {role === "educator" && (
                                    <div>
                                        <label htmlFor="inviteCode" className='block text-xs sm:text-sm font-semibold text-gray-700 mb-1'>
                                            Educator Invite Code
                                        </label>
                                        <input
                                            id='inviteCode'
                                            type="password"
                                            className='w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base'
                                            placeholder='Enter invite code'
                                            onChange={(e) => setInviteCode(e.target.value)}
                                            value={inviteCode}
                                            required={role === "educator"}
                                        />
                                        <p className='text-xs text-gray-500 mt-1'>
                                            You need an invite code to register as an educator
                                        </p>
                                    </div>
                                )}


                                {/* Sign Up Button or OTP Input */}
                                {!showOtpInput ? (
                                    <button
                                        type='button'
                                        className='w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base'
                                        disabled={loading}
                                        onClick={handleSignUp}
                                    >
                                        {loading ? (
                                            <div className='flex items-center justify-center'>
                                                <ClipLoader size={16} color='white' className='mr-2' />
                                                <span className='text-sm'>Sending OTP...</span>
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                ) : (
                                    <div className='space-y-3'>
                                        <label htmlFor="otp" className='block text-sm font-semibold text-gray-700'>Enter OTP sent to your email</label>
                                        <input
                                            id='otp'
                                            type='text'
                                            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500'
                                            placeholder='Enter OTP'
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            maxLength={6}
                                        />
                                        <button
                                            type='button'
                                            className='w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base'
                                            disabled={loading || otp.length !== 6}
                                            onClick={handleVerifyOtp}
                                        >
                                            {loading ? (
                                                <div className='flex items-center justify-center'>
                                                    <ClipLoader size={16} color='white' className='mr-2' />
                                                    <span className='text-sm'>Verifying...</span>
                                                </div>
                                            ) : (
                                                'Verify OTP & Complete Signup'
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className='flex items-center py-2'>
                                    <div className='flex-1 border-t border-gray-300'></div>
                                    <div className='px-3 text-xs sm:text-sm text-gray-500 bg-white'>Or continue with</div>
                                    <div className='flex-1 border-t border-gray-300'></div>
                                </div>

                                {/* Google Signup */}
                                <button
                                    type='button'
                                    className='w-full py-2.5 sm:py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 group'
                                    onClick={googleSignUp}
                                >
                                    <img src={google} alt="Google" className='w-4 h-4 sm:w-5 sm:h-5' />
                                    <span className='text-gray-700 font-medium group-hover:text-gray-900 text-sm sm:text-base'>Continue with Google</span>
                                </button>

                                {/* Login Link */}
                                <div className='text-center pt-2'>
                                    <span className='text-gray-600 text-sm'>Already have an account? </span>
                                    <button
                                        type='button'
                                        className='text-indigo-600 hover:text-indigo-700 font-semibold transition-colors text-sm'
                                        onClick={() => navigate("/login")}
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp
