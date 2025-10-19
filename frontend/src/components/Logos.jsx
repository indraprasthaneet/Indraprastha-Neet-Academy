import React from 'react'
import { FaClipboardList } from "react-icons/fa";
import { MdLiveHelp } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
function Logos() {
  return (
    <div className='w-[100vw] min-h-[90px]  flex items-center justify-center flex-wrap gap-4 md:mb-[50px] '>
        <div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer'>
            <FaClipboardList className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>20k+ Practice Questions</span>
        </div>
        <div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer'>
            <MdLiveHelp className='w-[30px] h-[30px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Lifetime Doubt Supports</span>
        </div>
        <div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer'>
            < BiTask className='w-[30px] h-[30px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Daily Mock Tests</span>
        </div>
        <div className='flex items-center justify-center gap-2  px-5 py-3  rounded-3xl bg-gray-200 cursor-pointer'>
            <FaUserGraduate className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Top Faculty Mentorship</span>
        </div>
        
      
    </div>
  )
}

export default Logos
