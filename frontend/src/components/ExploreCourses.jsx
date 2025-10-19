import React from 'react'
import { SiViaplay } from "react-icons/si";
import { FaClipboardList, FaUserGraduate, FaMicroscope, FaAtom, FaFlask, FaChartLine } from "react-icons/fa";
import { MdMenuBook, MdGroups } from "react-icons/md";
import { BiRefresh } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

function ExploreCourses() {
  const navigate = useNavigate();

  return (
    <div className='w-[100vw] min-h-[50vh] lg:h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-4 px-[30px] mt-[-30px]'>
      
      {/* Left Section: Heading & CTA */}
      <div className='w-[100%] lg:w-[350px] lg:h-[100%] h-[400px] flex flex-col items-start justify-center gap-1 md:px-[40px] px-[20px]'>
        <span className='text-[35px] font-semibold'>What </span>
        <span className='text-[35px] font-semibold'>We Provide</span>
        <p className='text-[17px] text-black'>
          From NCERT mastery to rank prediction, our modules are built to help you crack NEET with confidence.
        </p>
        {/* <button
          className='px-[20px] py-[10px] border-2 bg-black border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 mt-[40px]'
          onClick={() => navigate("/allcourses")}
        >
          Explore Courses <SiViaplay className='w-[30px] h-[30px] fill-white' />
        </button> */}
      </div>

      {/* Right Section: Course Grid */}
      <div className='w-[720px] max-w-[90%] lg:h-[300px] md:min-h-[300px] flex items-center justify-center lg:gap-[60px] gap-[50px] flex-wrap mb-[50px] lg:mb-[0px]'>

        {/* Each Card */}
        {[
          { icon: <MdMenuBook className='w-[50px] h-[50px]' />, label: "NCERT Mastery", bg: "#fbd9fb" },
          { icon: <FaChartLine className='w-[50px] h-[50px]' />, label: "Rank Predictor", bg: "#d9fbe0" },
          { icon: <BiRefresh className='w-[50px] h-[50px]' />, label: "Revision Packs", bg: "#fcb9c8" },
          { icon: <FaMicroscope className='w-[50px] h-[50px]' />, label: "Biology Deep Dive", bg: "#fbd9fb" },
          { icon: <FaAtom className='w-[50px] h-[50px]' />, label: "Physics Practice", bg: "#d9fbe0" },
          { icon: <FaFlask className='w-[50px] h-[50px]' />, label: "Chemistry Modules", bg: "#fcb9c8" },
          { icon: <FaClipboardList className='w-[50px] h-[50px]' />, label: "Mock Tests", bg: "#fbd9fb" },
          { icon: <MdGroups className='w-[50px] h-[50px]' />, label: "Mentorship Sessions", bg: "#d9fbe0" },
        ].map(({ icon, label, bg }, idx) => (
          <div key={idx} className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
            <div className={`w-[100px] h-[90px] bg-[${bg}] rounded-lg flex items-center justify-center text-[#6d6c6c]`}>
              {icon}
            </div>
            {label}
          </div>
        ))}

      </div>
    </div>
  );
}

export default ExploreCourses;
