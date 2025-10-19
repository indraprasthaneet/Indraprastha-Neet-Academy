import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaPause, FaRedo, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

function Playground() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuestion();
    
    // Start timer
    timerRef.current = setInterval(() => {
      if (isTimerRunning) {
        setTimeSpent(prev => prev + 1);
      }
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/questions/${questionId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setQuestion(response.data.question);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      toast.error('Failed to fetch question');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setTimeSpent(0);
  };

  const handleSubmit = async () => {
    if (!question) return;
    
    // Validate answer based on question type
    if (question.questionType === 'objective' && !selectedOption) {
      toast.error('Please select an option');
      return;
    }
    
    if (question.questionType === 'subjective' && !studentAnswer.trim()) {
      toast.error('Please provide your answer');
      return;
    }
    
    setIsSubmitting(true);
    setIsTimerRunning(false);
    
    try {
      const response = await axios.post(`${serverUrl}/api/questions/submit`, {
        questionId: question._id,
        selectedOption: question.questionType === 'objective' ? selectedOption : undefined,
        studentAnswer: question.questionType === 'subjective' ? studentAnswer : undefined,
        timeSpent
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setSubmissionResult({
          isCorrect: response.data.attempt.isCorrect,
          correctAnswer: response.data.correctAnswer,
          score: response.data.attempt.score,
          timeSpent: response.data.attempt.timeSpent
        });
        toast.success('Answer submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedOption('');
    setStudentAnswer('');
    setSubmissionResult(null);
    setTimeSpent(0);
    setIsTimerRunning(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={50} color="#FFD700" />
          <p className="text-gray-300 mt-4">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Question not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Question Playground
              </h1>
              <p className="text-gray-400">
                Class {question.class} - {question.subject} - {question.chapter}
              </p>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-[#1e1e1e] rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-mono font-bold text-[#FFD700]">
                {formatTime(timeSpent)}
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors"
              >
                {isTimerRunning ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={handleResetTimer}
                className="p-2 rounded-lg bg-[#333] text-white hover:bg-[#444] transition-colors"
              >
                <FaRedo />
              </button>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
              {question.questionType === 'objective' ? 'Objective' : 'Subjective'}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#1e1e1e] rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Q. {question.questionText}
          </h2>
          
          {/* Objective Question Options */}
          {question.questionType === 'objective' && (
            <div className="space-y-3 mb-6">
              {question.options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => !submissionResult && setSelectedOption(option)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedOption === option
                      ? 'border-[#FFD700] bg-[#FFD700]/10'
                      : 'border-gray-600 hover:border-gray-500'
                  } ${submissionResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      selectedOption === option
                        ? 'border-[#FFD700] bg-[#FFD700]'
                        : 'border-gray-400'
                    }`}>
                      {selectedOption === option && (
                        <div className="w-2 h-2 rounded-full bg-black"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-300 mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-gray-200">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Subjective Question Textarea */}
          {question.questionType === 'subjective' && (
            <div className="mb-6">
              <textarea
                value={studentAnswer}
                onChange={(e) => !submissionResult && setStudentAnswer(e.target.value)}
                disabled={!!submissionResult}
                rows={6}
                className="w-full p-4 bg-[#2a2a2a] text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent disabled:opacity-70"
                placeholder="Type your answer here..."
              />
            </div>
          )}
          
          {/* Submission Result */}
          {submissionResult && (
            <div className={`p-6 rounded-lg mb-6 ${
              submissionResult.isCorrect 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  submissionResult.isCorrect 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}>
                  <FaCheck className="text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${
                  submissionResult.isCorrect 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {submissionResult.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </h3>
              </div>
              
              {!submissionResult.isCorrect && question.questionType === 'objective' && (
                <div className="mb-4">
                  <p className="text-gray-300 mb-2">Correct Answer:</p>
                  <div className="p-3 bg-[#2a2a2a] rounded-lg">
                    <span className="text-gray-200">{submissionResult.correctAnswer}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Time Taken</p>
                  <p className="text-white font-semibold">{formatTime(submissionResult.timeSpent)}</p>
                </div>
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Score</p>
                  <p className="text-white font-semibold">{submissionResult.score}/100</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            {!submissionResult ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors font-medium flex items-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader size={16} color="#000000" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  'Submit Answer'
                )}
              </button>
            ) : (
              <button
                onClick={handleTryAgain}
                className="px-6 py-3 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors font-medium"
              >
                Try Again
              </button>
            )}
            
            <button
              onClick={() => navigate(`/question-bank/${question.class}/${encodeURIComponent(question.subject)}/${encodeURIComponent(question.chapter)}`)}
              className="px-6 py-3 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors font-medium"
            >
              Back to Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;