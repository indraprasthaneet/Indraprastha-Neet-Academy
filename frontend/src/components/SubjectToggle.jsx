import React from 'react';

const SubjectToggle = ({ 
  subjects = [], 
  selectedSubject, 
  onSubjectChange, 
  title = "Select Subject:",
  className = "" 
}) => {
  return (
    <div className={`bg-[#1e1e1e] rounded-xl shadow-sm p-6 mb-8 border border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onSubjectChange(subject)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:brightness-110 ${
              selectedSubject === subject
                ? "bg-[#FFD700] text-black shadow-lg"
                : "bg-[#333] text-white hover:bg-[#444]"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectToggle;