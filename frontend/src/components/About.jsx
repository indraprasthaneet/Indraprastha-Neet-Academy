import React from 'react';
import { useNavigate } from 'react-router-dom';
import about from "../assets/about.jpg";
import VideoPlayer from './VideoPlayer';
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck } from "react-icons/bi";
import TestPage from './TestPage';

function About() {
  const navigate = useNavigate();

  return (
    <div className='w-[100vw] flex flex-col items-center justify-center mt-35'>

      {/* About Section */}
      <div className='lg:h-[70vh] min-h-[50vh] flex flex-wrap items-center justify-center gap-2 mb-[30px]'>
        <div className='lg:w-[40%] md:w-[80%] w-[100%] h-[100%] flex items-center justify-center relative'>
          <img src={about} className='w-[80%] h-[90%] rounded-lg' alt="About Us" />
          <VideoPlayer />
        </div>

        <div className='lg:w-[50%] md:w-[70%] w-[100%] h-[100%] flex flex-col items-start justify-center px-[35px] md:px-[80px]'>
          <div className='flex text-[18px] items-center gap-[20px]'>
            About Us <TfiLayoutLineSolid className='w-[40px] h-[40px]' />
          </div>
          <div className='md:text-[45px] text-[35px] font-semibold'>
            We Maximize Your Learning Growth
          </div>
          <div className='text-[15px] text-gray-700'>
            We provide a modern Learning Management System to simplify NEET preparation, track progress, and enhance student-instructor collaboration efficiently.
          </div>

          <div className='w-full lg:w-[60%]'>
            <div className='flex items-center justify-between mt-[40px]'>
              <div className='flex items-center gap-[10px]'>
                <BiSolidBadgeCheck className='w-[20px] h-[20px]' /> Simplified Learning
              </div>
              <div className='flex items-center gap-[10px]'>
                <BiSolidBadgeCheck className='w-[20px] h-[20px]' /> Expert Trainers
              </div>
            </div>
            <div className='flex items-center justify-between mt-[20px]'>
              <div className='flex items-center gap-[10px]'>
                <BiSolidBadgeCheck className='w-[20px] h-[20px]' /> Big Experience
              </div>
              <div className='flex items-center gap-[10px]'>
                <BiSolidBadgeCheck className='w-[20px] h-[20px]' /> Lifetime Access
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PYQ Bundle Section */}
      {/* <div className='w-full flex flex-col items-center justify-center px-[30px] py-[40px] bg-[#f9f9f9]'>
        <h2 className='text-[30px] font-semibold mb-[20px]'>Previous Year Question Bundles</h2>
        <div className='flex flex-wrap gap-[40px] justify-center'>
          <div className='w-[280px] h-[180px] bg-white shadow-md rounded-lg p-[20px] flex flex-col justify-between'>
            <h3 className='text-[20px] font-medium'>Class 11 PYQ Bundle</h3>
            <p className='text-[14px] text-gray-600'>Topic-wise NEET questions with detailed solutions.</p>
            <button
              onClick={() => navigate("/pyq-bundles?class=11")}
              className='mt-[10px] px-[15px] py-[8px] bg-black text-white rounded-md text-[14px]'
            >
              View Bundle
            </button>
          </div>
          <div className='w-[280px] h-[180px] bg-white shadow-md rounded-lg p-[20px] flex flex-col justify-between'>
            <h3 className='text-[20px] font-medium'>Class 12 PYQ Bundle</h3>
            <p className='text-[14px] text-gray-600'>Chapter-wise NEET questions with expert explanations.</p>
            <button
              onClick={() => navigate("/pyq-bundles?class=12")}
              className='mt-[10px] px-[15px] py-[8px] bg-black text-white rounded-md text-[14px]'
            >
              View Bundle
            </button>
          </div>
        </div>
      </div> */}

      {/* Test Series Section */}
      {/* <TestPage/> */}
    </div>
  );
}

export default About;
