import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaTrophy, FaClock, FaEye, FaCheck, FaTimes, FaList } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import TestResults from '../components/TestResults';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

function Profile() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [testSummary, setTestSummary] = useState(null);
  const [mcqResults, setMcqResults] = useState([]);
  const [mcqSummary, setMcqSummary] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [questionAttempts, setQuestionAttempts] = useState([]);
  const [questionSummary, setQuestionSummary] = useState(null);

  // Memoize fetch functions to prevent unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    setUserLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/user/currentuser`, {
        withCredentials: true
      });
      if (response.data) {
        dispatch(setUserData(response.data));
        // After getting fresh user data, fetch related data
        if (response.data.role === 'student') {
          fetchTestSummary();
          fetchMcqResults();
          fetchQuestionAttempts();
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error loading profile data');
    } finally {
      setUserLoading(false);
    }
  }, [dispatch, serverUrl]);

  const fetchTestSummary = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/test-series/results`, {
        withCredentials: true
      });
      if (response.data.success) {
        setTestSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching test summary:', error);
    }
  }, [serverUrl]);

  const fetchMcqResults = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/mcq/student-results`, {
        withCredentials: true
      });
      if (response.data.success) {
        setMcqResults(response.data.results);
        setMcqSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching MCQ results:', error);
    }
  }, [serverUrl]);

  const fetchQuestionAttempts = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/questions/attempts/student`, {
        withCredentials: true
      });
      if (response.data.success) {
        setQuestionAttempts(response.data.attempts);
        setQuestionSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching question attempts:', error);
    }
  }, [serverUrl]);

  // Only run this effect once when the component mounts
  useEffect(() => {
    // Fetch fresh user data when component mounts
    fetchUserData();
  }, []); // Empty dependency array to run only once

  // Separate effect for student data that depends on userData.role
  useEffect(() => {
    if (userData && userData.role === 'student') {
      fetchTestSummary();
      fetchMcqResults();
      fetchQuestionAttempts();
    }
  }, [userData?.role, fetchTestSummary, fetchMcqResults, fetchQuestionAttempts]);

  const formatTime = useCallback((seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }, []);
  
  // Calculate score percentage
  const calculateScore = useCallback((isCorrect) => {
    return isCorrect ? 100 : 0;
  }, []);
  
  // Show loading state while fetching user data
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 py-10 flex items-center justify-center">
        <div className="bg-gray-800 shadow-lg rounded-2xl p-8 max-w-6xl w-full flex flex-col items-center justify-center">
          <ClipLoader size={50} color="#ffffff" />
          <p className="mt-4 text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  // Show message if no user data is available
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 px-4 py-10 flex items-center justify-center">
        <div className="bg-gray-800 shadow-lg rounded-2xl p-8 max-w-6xl w-full text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Welcome!</h2>
        
          <p className="text-gray-400">Please wait while we load your profile data...</p>
          <button 
            onClick={fetchUserData}
            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reload Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10 flex items-center justify-center ">
      <div className="bg-gray-800 shadow-lg rounded-2xl p-8 max-w-6xl w-full relative text-gray-100">
        <FaArrowLeft className='absolute top-[3%] left-[3%] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/")} />
        
        {/* Success message after MCQ submission */}
        {userData && (
          <div className="mb-6 p-4  rounded-lg">
            <p className="text-green-200 text-center font-medium">
              Welcome, {userData.name}! 
            </p>
          </div>
        )}
        
        {/* Latest MCQ Result Display */}
        {/* {latestMcqResult && (
          <div className={`mb-6 p-6 rounded-lg border ${
            latestMcqResult.isCorrect 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Latest MCQ Result</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                latestMcqResult.isCorrect 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {latestMcqResult.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Question:</p>
              <p className="text-gray-600 mt-1">{latestMcqResult.mcqId.question}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <FaClock className="mr-2 text-blue-500" />
                  Time Taken
                </p>
                <p className="text-lg font-bold text-blue-600 mt-1">
                  {formatTime(latestMcqResult.timeSpent)}
                </p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Score</p>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  {calculateScore(latestMcqResult.isCorrect)}%
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Result</p>
                <p className={`text-lg font-bold mt-1 ${
                  latestMcqResult.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {latestMcqResult.isCorrect ? 'Passed' : 'Failed'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                <p className={`text-sm p-2 rounded mt-1 ${
                  latestMcqResult.isCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {latestMcqResult.selectedAnswer}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Correct Answer:</p>
                <p className="text-sm p-2 bg-green-100 text-green-800 rounded mt-1">
                  {latestMcqResult.mcqId.correctAnswer}
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Submitted on {new Date(latestMcqResult.submittedAt).toLocaleString()}
            </div>
          </div>
        )
         */}
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 ">
          <div className="flex -space-x-3  p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-white'
                  : 'text-gray-300'
              }`}
            >
              Profile Data
            </button>
            {userData && userData.role === 'student' && (
              <button
                onClick={() => setActiveTab('mcq-results')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'mcq-results'
                    ? ' text-white'
                    : 'text-gray-300'
                }`}
              >
                MCQ Results
              </button>
            )}
            {userData && userData.role === 'student' && (
              <button
                onClick={() => setActiveTab('question-results')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'question-results'
                    ? ' text-white'
                    : 'text-gray-300'
                }`}
              >
                Question Results
              </button>
            )}
            {userData && userData.role === 'student' && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'results'
                    ? ' text-white'
                    : 'text-gray-300 '
                }`}
              >
                Test Results
              </button>
            )}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
              {userData && userData.photoUrl ? (
                <img
                  src={userData?.photoUrl}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
                />
              ) : (
                <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-gray-900 border-white cursor-pointer'>
                  {userData && userData?.name ? userData?.name.slice(0, 1).toUpperCase() : 'U'}
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4 text-gray-100">{userData && userData.name}</h2>
              <p className="text-sm text-gray-300">{userData && userData.role}</p>
            </div>

            {/* Profile Info */}
            <div className="mt-6 space-y-4">
              <div className="text-sm">
                <span className="font-semibold text-gray-300">Email: </span>
                <span className="text-gray-200">{userData && userData.email}</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold text-gray-300">Bio: </span>
                <span className="text-gray-200">{userData && (userData.description || 'No bio available')}</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold text-gray-300">Enrolled Courses: </span>
                <span className="text-gray-200">{userData && userData.enrolledCourses ? userData.enrolledCourses.length : 0}</span>
              </div>

              {/* Test Summary for Students */}
              {userData && userData.role === 'student' && testSummary && (
                <div className="mt-6 p-4 bg-transparent rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Test Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-blue-300 mb-2">
                        <FaChartLine />
                        <span className="text-2xl font-bold text-gray-100">{testSummary.totalAttempts}</span>
                      </div>
                      <p className="text-sm text-gray-300">Tests Taken</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-yellow-300 mb-2">
                        <FaTrophy />
                        <span className="text-2xl font-bold text-gray-100">{testSummary.averageScore}%</span>
                      </div>
                      <p className="text-sm text-gray-300">Average Score</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-green-300 mb-2">
                        <FaEye />
                        <span className="text-2xl font-bold text-gray-100">{testSummary.bestScore}%</span>
                      </div>
                      <p className="text-sm text-gray-300">Best Score</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-purple-300 mb-2">
                        <FaClock />
                        <span className="text-2xl font-bold text-gray-100">{formatTime(testSummary.totalTimeSpent)}</span>
                      </div>
                      <p className="text-sm text-gray-300">Total Time</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-center gap-4">
              <button 
                className="px-5 py-2 rounded bg-gray-900 text-white active:bg-gray-700 cursor-pointer transition" 
                onClick={() => navigate("/editprofile")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}

        {/* MCQ Results Tab */}
        {activeTab === 'mcq-results' && userData && userData.role === 'student' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">MCQ of the Day Results</h2>
            
            {/* MCQ Summary */}
            {mcqSummary && (
              <div className="mb-8 p-6 bg-gradient-to-r bg-transparent border border-gray-200 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mcqSummary.totalAttempts}</div>
                    <p className="text-sm text-gray-300">Total Attempts</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">{mcqSummary.correctAnswers}</div>
                    <p className="text-sm text-gray-300">Correct</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-300">{mcqSummary.wrongAnswers}</div>
                    <p className="text-sm text-gray-300">Wrong</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300">{mcqSummary.accuracyPercentage}%</div>
                    <p className="text-sm text-gray-300">Accuracy</p>
                  </div>
                </div>
              </div>
            )}

            {/* MCQ Results List */}
            {mcqResults && mcqResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No MCQ attempts yet</p>
                <p className="text-gray-500 text-sm mt-2">Try today's MCQ to see your results here!</p>
                <button
                  onClick={() => navigate('/mcq-of-the-day')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to MCQ of the Day
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {mcqResults && mcqResults.map((result) => (
                  <div key={result._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100">{result.mcqId.subject}</h4>
                        <p className="text-sm text-gray-300">
                          {result.mcqId.chapter} • {result.mcqId.topic}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          result.isCorrect 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {result.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-200 font-medium mb-2">Question:</p>
                      <p className="text-gray-300 text-sm">{result.mcqId.question}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-blue-900 p-3 rounded-lg text-white">
                        <p className="text-xs font-medium flex items-center">
                          <FaClock className="mr-1 text-blue-300" />
                          Time Taken
                        </p>
                        <p className="font-bold mt-1">
                          {formatTime(result.timeSpent)}
                        </p>
                      </div>
                      
                      <div className="bg-purple-900 p-3 rounded-lg text-white">
                        <p className="text-xs font-medium">Score</p>
                        <p className="font-bold text-purple-300 mt-1">
                          {calculateScore(result.isCorrect)}%
                        </p>
                      </div>
                      
                      <div className="bg-gray-700 p-3 rounded-lg md:col-span-2">
                        <p className="text-xs font-medium text-gray-300">Result</p>
                        <p className={`text-lg font-bold mt-1 ${
                          result.isCorrect ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {result.isCorrect ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-1">Your Answer:</p>
                        <p className={`text-sm p-2 rounded ${result.isCorrect ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                          {result.selectedAnswer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-1">Correct Answer:</p>
                        <p className="text-sm p-2 bg-green-900 text-green-200 rounded">
                          {result.mcqId.correctAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Question Results Tab */}
        {activeTab === 'question-results' && userData && userData.role === 'student' && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              
              Question Bank Results
            </h2>
            
            {/* Question Summary */}
            {questionSummary && (
              <div className="mb-8 p-6 bg-transparent border border-gray-200 rounded-lg">
              
                <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{questionSummary.totalAttempts}</div>
                    <p className="text-sm text-gray-600">Total Attempts</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{questionSummary.correctAnswers}</div>
                    <p className="text-sm text-gray-600">Correct</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{questionSummary.totalScore}</div>
                    <p className="text-sm text-gray-600">Total Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">{questionSummary.averageScore}</div>
                    <p className="text-sm text-gray-600">Average Score</p>
                  </div>
                </div>
              </div>
            )}

            {/* Question Attempts List */}
            {questionAttempts && questionAttempts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No question attempts yet</p>
                <p className="text-gray-400 text-sm mt-2">Try questions from the Question Bank to see your results here!</p>
                <button
                  onClick={() => navigate('/question-bank')}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Go to Question Bank
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questionAttempts && questionAttempts.map((attempt) => (
                  <div key={attempt._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {attempt.questionId.subject} - {attempt.questionId.chapter}
                        </h4>
                        <p className="text-sm text-white">
                          Class {attempt.questionId.class} • {attempt.questionId.questionType}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          attempt.isCorrect 
                            ? 'bg-transparent border border-gray-200 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-white font-medium mb-2">Question:</p>
                      <p className="text-white text-sm">{attempt.questionId.questionText}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-transparent border border-gray-200 p-3 rounded-lg">
                        <p className="text-xs font-medium text-white flex items-center">
                          <FaClock className="mr-1 text-blue-500" />
                          Time Taken
                        </p>
                        <p className="font-bold text-blue-600 mt-1">
                          {formatTime(attempt.timeSpent)}
                        </p>
                      </div>
                      
                      <div className="bg-transparent border border-gray-200 p-3 rounded-lg">
                        <p className="text-xs font-medium text-white">Score</p>
                        <p className="font-bold text-purple-600 mt-1">
                          {attempt.score}/100
                        </p>
                      </div>
                      
                      <div className="bg-transparent border border-gray-200 p-3 rounded-lg md:col-span-2">
                        <p className="text-xs font-medium text-white">Question Type</p>
                        <p className="font-bold text-white mt-1">
                          {attempt.questionId.questionType === 'objective' ? 'Objective' : 'Subjective'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-white mb-1">
                          {attempt.questionId.questionType === 'objective' ? 'Your Selection:' : 'Your Answer:'}
                        </p>
                        <p className={`text-sm p-2 rounded ${
                          attempt.isCorrect ? 'bg-transparent border border-gray-200 text-green-700' : 'bg-transparent border border-gray-200 text-red-700'
                        }`}>
                          {attempt.questionId.questionType === 'objective' 
                            ? attempt.selectedOption 
                            : attempt.studentAnswer}
                        </p>
                      </div>
                      {attempt.questionId.questionType === 'objective' && (
                        <div>
                          <p className="text-sm font-medium text-white mb-1">Correct Answer:</p>
                          <p className="text-sm p-2 bg-transparent border border-gray-200 text-green-700 rounded">
                            {attempt.questionId.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Test Results Tab */}
        {activeTab === 'results' && userData && userData.role === 'student' && (
          <div>
            <TestResults />
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile;