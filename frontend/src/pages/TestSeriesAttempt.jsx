import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';
import { FaClock, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';

const TestSeriesAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeAlloted, setTotalTimeAlloted] = useState(null);

  useEffect(() => {
    if (!userData) {
      toast.error('Please login to take tests');
      navigate('/login');
      return;
    }
    fetchTest();
  }, [id, userData, navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/test-series/${id}`, {
        withCredentials: true
      });

      if (response.data.success) {
        const testData = response.data.test;
        setTest(testData);
        
        // Check if already attempted
        if (response.data.attempted) {
          toast.info('You have already attempted this test');
          navigate('/test-series');
          return;
        }

        // Set timer (e.g., 2 minutes per question)
        const totalTime = testData.questions.length * 120; // 2 minutes per question in seconds
        setTimeLeft(totalTime);
        setTotalTimeAlloted(totalTime);
        setStartTime(new Date());
        
        // Initialize answers
        const initialAnswers = {};
        testData.questions.forEach((question, index) => {
          initialAnswers[index] = '';
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error fetching test:', error);
      toast.error('Error loading test');
      navigate('/test-series');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Calculate time spent
    const currentTime = new Date();
    const timeSpentInSeconds = startTime ? Math.floor((currentTime - startTime) / 1000) : 0;

    // Convert answers to array format
    const answersArray = test.questions.map((question, index) => ({
      questionIndex: index,
      selectedAnswer: answers[index] || ''
    }));

    // Check if all questions are answered
    const unanswered = answersArray.filter(answer => !answer.selectedAnswer).length;
    
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered questions. Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${serverUrl}/api/test-series/${id}/submit`,
        { 
          answers: answersArray,
          timeSpent: timeSpentInSeconds,
          timeAlloted: totalTimeAlloted,
          startedAt: startTime?.toISOString()
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { result } = response.data;
        toast.success(
          `Test submitted! Score: ${result.score}/${result.totalQuestions} (${result.percentage}%)`
        );
        navigate('/test-series');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error(error.response?.data?.message || 'Error submitting test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(answer => answer !== '').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Test not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1e1e1e] rounded-xl shadow-xl p-6 mb-8 border border-gray-700 mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{test.subject}</h1>
              <p className="text-gray-400">Chapter: {test.chapter} | Topic: {test.topic}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-6">
                {timeLeft !== null && (
                  <div className="flex items-center space-x-2">
                    <FaClock className="w-6 h-6 text-[#FFD700]" />
                    <span className={`text-xl font-mono font-bold ${
                      timeLeft < 300 ? 'text-red-400' : 'text-white'
                    }`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-[#FFD700]">{getAnsweredCount()}</span> / {test.questions.length} answered
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#333] rounded-full h-3">
            <div 
              className="bg-[#FFD700] h-3 rounded-full transition-all duration-300"
              style={{ width: `${(getAnsweredCount() / test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {test.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-[#1e1e1e] rounded-xl shadow-xl p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    answers[questionIndex] 
                      ? 'bg-[#FFD700] bg-opacity-20 border-2 border-[#FFD700] text-[#FFD700]' 
                      : 'bg-[#333] border-2 border-gray-600 text-gray-400'
                  }`}>
                    {answers[questionIndex] ? (
                      <FaCheckCircle className="w-5 h-5" />
                    ) : (
                      <FaQuestionCircle className="w-5 h-5" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Question {questionIndex + 1}: {question.text}
                  </h3>
                  
                  <div className="space-y-4">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          answers[questionIndex] === option
                            ? 'bg-[#FFD700] bg-opacity-10 border-[#FFD700] shadow-lg'
                            : 'bg-[#2a2a2a] border-gray-600 hover:border-[#FFD700] hover:bg-[#FFD700] hover:bg-opacity-5'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={option}
                          checked={answers[questionIndex] === option}
                          onChange={() => handleAnswerChange(questionIndex, option)}
                          className="mr-4 w-5 h-5 text-[#FFD700] bg-[#333] border-gray-600 focus:ring-[#FFD700] focus:ring-2"
                        />
                        <span className="text-gray-300 text-lg">
                          <span className="font-bold mr-3 text-[#FFD700]">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="bg-[#1e1e1e] rounded-xl shadow-xl p-6 mt-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to submit?</h3>
              <p className="text-gray-400">
                You have answered {getAnsweredCount()} out of {test.questions.length} questions.
              </p>
              {getAnsweredCount() < test.questions.length && (
                <p className="text-orange-400 text-sm mt-1">
                  Warning: {test.questions.length - getAnsweredCount()} questions remain unanswered.
                </p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-0 bg-[#FFD700] text-black font-bold text-sm rounded-lg hover:bg-[#ffed4e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-[#1e1e1e] rounded-xl shadow-xl p-6 mt-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Question Navigation</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {test.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const element = document.querySelector(`input[name="question-${index}"]`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`w-12 h-12 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-105 ${
                  answers[index]
                    ? 'bg-[#FFD700] text-black shadow-lg'
                    : 'bg-[#333] text-gray-400 hover:bg-[#444] border border-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-8 mt-6 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-[#FFD700] rounded"></div>
              <span className="text-gray-300">Answered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-[#333] border border-gray-600 rounded"></div>
              <span className="text-gray-300">Not Answered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSeriesAttempt;