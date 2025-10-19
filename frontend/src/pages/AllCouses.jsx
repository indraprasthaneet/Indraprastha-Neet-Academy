import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { FaArrowLeft } from "react-icons/fa";

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  
  // Define the NEET courses data
  const neetCourses = [
    {
      id: 1,
      title: "Physics (Class 11)",
      description: "Focused on NEET preparation for Class 11 Physics",
      image: "physics"
    },
    {
      id: 2,
      title: "Chemistry (Class 11)",
      description: "Comprehensive NEET preparation for Class 11 Chemistry",
      image: "chemistry"
    },
    {
      id: 3,
      title: "Biology (Class 12)",
      description: "Complete NEET Biology syllabus for Class 12",
      image: "biology"
    },
    {
      id: 4,
      title: "Physics (Class 12)",
      description: "Advanced NEET Physics concepts for Class 12",
      image: "physics"
    },
    {
      id: 5,
      title: "NEET Mock Tests",
      description: "Full-length mock tests for NEET preparation",
      image: "mock"
    }
  ];

  // Function to handle card click
  const handleCardClick = () => {
    alert("🚀 Coming Soon!");
  };

  // Function to get icon based on course type
  const getCourseIcon = (imageType) => {
    switch(imageType) {
      case "physics":
        return "⚛️";
      case "chemistry":
        return "🧪";
      case "biology":
        return "🧬";
      case "mock":
        return "📝";
      default:
        return "📚";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav/>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarVisible(prev => !prev)}
        className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black"
      >
        {isSidebarVisible ? 'Hide' : 'Show'} Filters
      </button>

      {/* Main Courses Section */}
      <main className="w-full transition-all duration-300 py-[130px] md:pl-[300px] flex flex-col items-center justify-center px-4">
        <div className="max-w-6xl w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">NEET Preparation Courses</h1>
            <button 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft /> Back to Home
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {neetCourses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer transform hover:-translate-y-1"
                onClick={handleCardClick}
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex items-center justify-center">
                  <span className="text-4xl">{getCourseIcon(course.image)}</span>
                </div>
                
                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                  <p className="text-gray-600 text-sm">{course.description}</p>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      NEET Preparation
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllCourses;