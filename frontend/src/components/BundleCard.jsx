import React from 'react';
import { FiBook, FiChevronRight } from 'react-icons/fi';

const BundleCard = ({ 
  title, 
  description, 
  subjects = [], 
  icon: Icon = FiBook,
  onClick,
  className = ""
}) => {
  return (
    <div
      className={`bg-[#1e1e1e] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-700 ${className}`}
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-300">{description}</p>
          </div>
          <Icon className="text-4xl text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-2">Subjects Available:</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <span key={subject} className="px-3 py-1 bg-[#333] text-gray-300 rounded-full text-sm">
                  {subject}
                </span>
              ))}
            </div>
          </div>
          <FiChevronRight className="text-2xl text-gray-500 group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

export default BundleCard;