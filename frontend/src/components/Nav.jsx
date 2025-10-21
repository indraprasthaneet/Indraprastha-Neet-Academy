import React, { useState } from 'react';
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import companylogo from "../assets/companylogo.png";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import newLogo from "../assets/newLogo.jpg"

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error?.response?.data?.message || "Logout error");
    }
  };

  const getInitial = () => {
    return userData?.name ? userData.name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div>
      <div className='w-full h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10'>
        {/* Logo */}
        <div className='lg:w-[20%] w-[40%] lg:pl-[75px] ml-10 md:ml-4 relative'>
          <img
            src={newLogo}
            className='w-[50px] h-[50px] rounded-full border-2 border-white cursor-pointer object-cover'
            onClick={() => navigate("/")}
            alt="Company Logo"
          />
        </div>

        {/* Right Controls */}
        <div className='flex items-center justify-end gap-3'>
          <div className='flex items-center gap-3'>
            {userData?.role === "educator" && (
              <div
                className='hidden lg:flex px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[16px] font-light cursor-pointer bg-[#000000d5]'
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </div>
            )}

            {!userData ? (
              <span
                className='px-[15px] py-[8px] md:px-[20px] md:py-[10px] border-2 border-white text-white rounded-[10px] text-[16px] font-light cursor-pointer bg-[#000000d5]'
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            ) : (
              <div
                className='w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full text-white flex items-center justify-center text-[18px] border-2 bg-black border-white cursor-pointer'
                onClick={() => setShowPro(prev => !prev)}
              >
                {userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    className='w-full h-full rounded-full object-cover'
                    alt="Profile"
                  />
                ) : (
                  <div className='w-full h-full rounded-full text-white flex items-center justify-center text-[18px] bg-black'>
                    {getInitial()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        {showPro && (
          <div className='absolute top-[80px] right-[20px] md:right-[5%] flex items-center flex-col justify-center gap-2 text-[16px] rounded-md bg-white px-[15px] py-[10px] border-[2px] border-black shadow-lg z-20'>
            <span
              className='bg-black text-white px-[30px] py-[10px] rounded-2xl hover:bg-gray-600 w-full text-center'
              onClick={() => {
                navigate("/profile");
                setShowPro(false);
              }}
            >
              My Profile
            </span>
            <span
              className='bg-black text-white hover:bg-gray-600 px-[25px] py-[10px] rounded-2xl w-full text-center'
              onClick={() => {
                navigate("/allcourses");
                setShowPro(false);
              }}
            >
              Courses
            </span>
            {userData && (
              <span
                className='bg-red-600 text-white hover:bg-red-700 px-[25px] py-[10px] rounded-2xl w-full text-center'
                onClick={() => {
                  handleLogout();
                  setShowPro(false);
                }}
              >
                Logout
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mobile Slide-Out Menu */}
      <div
        className={`fixed top-0 w-full h-full bg-[#000000f2] flex items-center justify-center flex-col gap-5 z-20 transition-transform duration-300 ease-in-out ${
          showHam ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <GiSplitCross
          className='w-[35px] h-[35px] fill-white absolute top-5 right-[4%]'
          onClick={() => setShowHam(false)}
        />

        {userData ? (
          <div className='w-[60px] h-[60px] rounded-full text-white flex items-center justify-center text-[24px] border-2 bg-black border-white mb-4'>
            {userData?.photoUrl ? (
              <img
                src={userData.photoUrl}
                className='w-full h-full rounded-full object-cover'
                alt="Profile"
              />
            ) : (
              <div className='w-full h-full rounded-full text-white flex items-center justify-center'>
                {getInitial()}
              </div>
            )}
          </div>
        ) : (
          <IoMdPerson className='w-[60px] h-[60px] fill-white cursor-pointer border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-full p-[10px] mb-4' />
        )}

        <span
          className='text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[65px] py-[15px] text-[18px] w-[80%] max-w-[300px]'
          onClick={() => {
            navigate("/profile");
            setShowHam(false);
          }}
        >
          My Profile
        </span>

        <span
          className='text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[65px] py-[15px] text-[18px] w-[80%] max-w-[300px]'
          onClick={() => {
            navigate("/enrolledcourses");
            setShowHam(false);
          }}
        >
          My Courses
        </span>

        {userData?.role === "educator" && (
          <div
            className='text-[18px] text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[60px] py-[15px] w-[80%] max-w-[300px]'
            onClick={() => {
              navigate("/dashboard");
              setShowHam(false);
            }}
          >
            Dashboard
          </div>
        )}

        {!userData ? (
          <span
            className='text-[18px] text-white border-[2px] border-[#fdfbfb7a] bg-[#000000d5] rounded-lg px-[80px] py-[15px] w-[80%] max-w-[300px]'
            onClick={() => {
              navigate("/login");
              setShowHam(false);
            }}
          >
            Login
          </span>
        ) : (
          <span
            className='text-[18px] text-white border-[2px] border-red-500 bg-red-600 rounded-lg px-[75px] py-[15px] w-[80%] max-w-[300px]'
            onClick={() => {
              handleLogout();
              setShowHam(false);
            }}
          >
            Logout
          </span>
        )}
      </div>
    </div>
  );
}

export default Nav;
