import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm w-full border border-gray-100 hover:border-gray-200">
      {/* Header with Profile Image and User Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=64`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-lg leading-tight">{name}</h4>
          <p className="text-sm text-gray-500 font-medium">{role}</p>
        </div>
      </div>

      {/* ⭐ Rating Stars */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-1 text-yellow-400 text-lg">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="transition-transform hover:scale-110">
                {i < rating ? <FaStar/> : <FaRegStar className="text-gray-300"/>}
              </span>
            ))}
        </div>
        <span className="ml-3 text-sm font-semibold text-gray-600">({rating}/5)</span>
      </div>

      {/* 💬 Review Text */}
      <div className="relative">
        <div className="absolute -top-2 -left-2 text-4xl text-blue-100 font-serif">"</div>
        <p className="text-gray-700 text-base leading-relaxed pl-6 pr-2 italic font-medium">
          {text}
        </p>
        <div className="absolute -bottom-4 -right-2 text-4xl text-blue-100 font-serif rotate-180">"</div>
      </div>

      {/* Academy Badge */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide">
            INDRAPRASTHA NEET ACADEMY
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
