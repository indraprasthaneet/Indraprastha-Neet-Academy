import React from 'react';

const VideoSolution = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Video Solutions</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Access detailed video solutions for complex problems across various subjects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">Latest Solutions</h3>
              <p className="text-red-600 text-sm">50+ New Videos This Week</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">Popular Topics</h3>
              <p className="text-orange-600 text-sm">Most Watched Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSolution;