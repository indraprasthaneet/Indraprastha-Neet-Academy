import React from 'react';
import { FaTimes, FaPlayCircle } from 'react-icons/fa';

const VideoSolutionModal = ({ isOpen, onClose, videoUrl, questionText }) => {
  if (!isOpen) return null;

  // Extract YouTube video ID from various YouTube URL formats
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <FaPlayCircle className="text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Video Solution</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Question reference */}
          {questionText && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Question:</h3>
              <p className="text-gray-600 text-sm">{questionText}</p>
            </div>
          )}

          {/* Video Player */}
          {videoId ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Video Solution"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">Invalid YouTube URL. Please check the video link.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSolutionModal;