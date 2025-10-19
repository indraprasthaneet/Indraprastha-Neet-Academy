import React from 'react';

const Pearl = () => {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-6 ml-10">PEARL</h1>
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <p className="text-gray-300 mb-4">
            Premium Educational Acceleration and Research Learning - Advanced study materials and research resources.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pink-900 p-4 rounded-lg border border-pink-700 text-pink-200">
              <h3 className="font-semibold mb-2">Research Papers</h3>
              <p className="text-sm">Access to latest academic research</p>
            </div>
            <div className="bg-purple-900 p-4 rounded-lg border border-purple-700 text-purple-200">
              <h3 className="font-semibold mb-2">Advanced Materials</h3>
              <p className="text-sm">In-depth study resources</p>
            </div>
            <div className="bg-indigo-900 p-4 rounded-lg border border-indigo-700 text-indigo-200">
              <h3 className="font-semibold mb-2">Expert Sessions</h3>
              <p className="text-sm">Live discussions with experts</p>
            </div>
            <div className="bg-teal-900 p-4 rounded-lg border border-teal-700 text-teal-200">
              <h3 className="font-semibold mb-2">Case Studies</h3>
              <p className="text-sm">Real-world problem analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pearl;