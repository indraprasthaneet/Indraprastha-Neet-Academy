import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';
import { FaPlay, FaCheck, FaClock, FaUser, FaCalendarAlt } from 'react-icons/fa';

const TestSeriesList = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching tests for student...', userData);
      const response = await axios.get(`${serverUrl}/api/test-series`, {
        withCredentials: true
      });
      
      console.log('API Response:', response.data);
      if (response.data.success) {
        console.log('Tests fetched:', response.data.tests);
        setTests(response.data.tests);
      } else {
        console.log('API returned success: false');
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Error fetching tests');
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) {
      toast.error('Please login to access tests');
      navigate('/login');
      return;
    }
    fetchTests();
  }, [userData, navigate, fetchTests]);

  const handleStartTest = (testId) => {
    navigate(`/test-series/${testId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading test series...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Test Series</h1>
        
        {tests.length === 0 ? (
          <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-12 text-center border border-gray-700">
            <FaClock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tests Available</h3>
            <p className="text-gray-400">No tests are currently available. Check back later!</p>
          </div>
        ) : (
          <div className="bg-[#1e1e1e] rounded-xl shadow-sm overflow-hidden border border-gray-700">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <div key={test._id} className={`bg-[#2a2a2a] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-600 ${
                    test.attempted ? 'opacity-80' : 'hover:border-[#FFD700]'
                  }`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{test.subject}</h3>
                          <p className="text-sm text-gray-400 mb-1">Chapter: {test.chapter}</p>
                          <p className="text-sm text-gray-400">Topic: {test.topic}</p>
                        </div>
                        {test.attempted && (
                          <div className="px-2 py-1 rounded-full bg-[#FFD700] bg-opacity-20 border border-[#FFD700]">
                            <FaCheck className="w-4 h-4 text-[#FFD700]" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <FaUser className="w-4 h-4 mr-2 text-[#FFD700]" />
                          <span>By: {test.createdBy?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <FaCalendarAlt className="w-4 h-4 mr-2 text-[#FFD700]" />
                          <span>Created: {new Date(test.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          <span className="text-[#FFD700]">Questions:</span> {test.questions?.length || 0}
                        </div>
                      </div>

                      {test.attempted && (
                        <div className="mb-4">
                          <div className="text-gray-300 text-sm">
                            <span className="font-medium">Score: </span>
                            <span className="font-bold text-white">
                              {test.score}/{test.questions?.length || 0}
                            </span>
                          </div>
                          {test.submittedAt && (
                            <div className="text-gray-300 text-sm mt-1">
                              <span className="font-medium">Date: </span>
                              <span className="text-white">
                                {new Date(test.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => handleStartTest(test._id)}
                        disabled={test.attempted}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                          test.attempted
                            ? 'bg-[#333] text-gray-500 cursor-not-allowed'
                            : 'bg-[#FFD700] text-black hover:bg-[#ffed4e] hover:shadow-lg transform hover:scale-105'
                        }`}
                      >
                        {test.attempted ? (
                          <>
                            <FaCheck className="w-5 h-5" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <FaPlay className="w-5 h-5" />
                            <span>Start Test</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSeriesList;