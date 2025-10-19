import React, { useState } from 'react';
import google from '../assets/google.jpg';
import axios from 'axios';
import { serverUrl } from '../App';
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import companylogo from "../assets/companylogo.jpg";
import { auth,provider } from "../utils/Firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));

      // Replace login with home, then push pyq-bundles
      // navigate("/", { replace: true });*
      navigate("/");

      setLoading(false);
      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

 const googleLogin = async () => {
  try {
    const response = await signInWithPopup(auth, provider);
    const user = response.user;

    const name = user.displayName;
    const email = user.email;

    try {
      // Try to login with Google credentials
      const result = await axios.post(
        `${serverUrl}/api/auth/googlesignup`,
        { email },
        { withCredentials: true }
      );

      if (result.data) {
        // User exists, set user data and redirect
        dispatch(setUserData(result.data));
        navigate("/");
        toast.success("Login Successfully");
      }
    } catch (error) {
      // If user doesn't exist (404) redirect to signup
      if (error.response?.status === 404) {
        navigate("/signup", { 
          state: { 
            googleData: { name, email }
          }
        });
        toast.info("Please complete signup to continue");
      } else {
        throw error; // Re-throw unexpected errors
      }
    }
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      toast.info("Google login was cancelled");
    } else {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "Google login failed");
    }
  }
};

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl h-auto lg:h-[600px] bg-white shadow-2xl rounded-3xl overflow-hidden'>
        <div className='flex flex-col lg:flex-row h-full'>
          {/* Left Side - Hero Section */}
          <div className='lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-10'>
              <div className='absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32'></div>
              <div className='absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48'></div>
              <div className='absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full'></div>
            </div>
            
            {/* Content */}
            <div className='relative z-10 text-center space-y-6'>
              {/* Logo */}
              <div className='mb-8'>
                <img 
                  src={companylogo} 
                  className='w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-full object-cover shadow-xl border-4 border-white/20' 
                  alt="Company Logo" 
                />
              </div>
              
              {/* Title */}
              <div className='space-y-4'>
                <h1 className='text-3xl lg:text-4xl font-bold leading-tight'>
                  Indraprastha Neet 
                  <br />
                  <span className='text-yellow-300'>Academy</span>
                </h1>
                <p className='text-lg lg:text-xl text-blue-100 max-w-md mx-auto leading-relaxed'>
                  Empowering students to achieve excellence through innovative learning solutions
                </p>
              </div>
              
              {/* CTA Button (Optional) */}
              <div className='pt-6'>
                <div className='inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 cursor-pointer group'>
                  <span className='mr-2'>Ready to Learn?</span>
                  <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className='lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center'>
            <div className='max-w-md mx-auto w-full space-y-6'>
              {/* Header */}
              <div className='text-center lg:text-left space-y-2'>
                <h2 className='text-3xl lg:text-4xl font-bold text-gray-900'>Welcome Back</h2>
                <p className='text-gray-600 text-lg'>Login to continue your learning journey</p>
              </div>

              {/* Form */}
              <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
                {/* Email Field */}
                <div className='space-y-2'>
                  <label htmlFor="email" className='block text-sm font-semibold text-gray-700'>
                    Email Address
                  </label>
                  <input
                    id='email'
                    type="email"
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500'
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <label htmlFor="password" className='block text-sm font-semibold text-gray-700'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      type={show ? "text" : "password"}
                      className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500'
                      placeholder='Enter your password'
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    <button
                      type='button'
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                      onClick={() => setShow(prev => !prev)}
                    >
                      {show ? (
                        <MdRemoveRedEye className='w-5 h-5' />
                      ) : (
                        <MdOutlineRemoveRedEye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className='text-right'>
                  <button
                    type='button'
                    className='text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors'
                    onClick={() => navigate("/forgotpassword")}
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type='button'
                  className='w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                  disabled={loading}
                  onClick={handleLogin}
                >
                  {loading ? (
                    <div className='flex items-center justify-center'>
                      <ClipLoader size={20} color='white' className='mr-2' />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className='flex items-center'>
                  <div className='flex-1 border-t border-gray-300'></div>
                  <div className='px-4 text-sm text-gray-500 bg-white'>Or continue with</div>
                  <div className='flex-1 border-t border-gray-300'></div>
                </div>

                {/* Google Login */}
                <button
                  type='button'
                  className='w-full py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 group'
                  onClick={googleLogin}
                >
                  <img src={google} alt="Google" className='w-5 h-5' />
                  <span className='text-gray-700 font-medium group-hover:text-gray-900'>Continue with Google</span>
                </button>

                {/* Sign Up Link */}
                <div className='text-center pt-4'>
                  <span className='text-gray-600'>Don't have an account? </span>
                  <button
                    type='button'
                    className='text-indigo-600 hover:text-indigo-700 font-semibold transition-colors'
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
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

export default Login;
