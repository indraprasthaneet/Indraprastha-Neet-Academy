import React from 'react';

const WhatsIncluded = ({ title = "What's Included?", items = [], className = "" }) => {
  return (
    <div className={`bg-[#1e1e1e] rounded-xl shadow-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsIncluded;