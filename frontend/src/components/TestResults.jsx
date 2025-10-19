import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartLine,
  FaCalendarAlt,
  FaEye,
  FaTrophy
} from 'react-icons/fa';

const TestResults = () => {
  const { userData } = useSelector((state) => state.user);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (userData) {
      fetchTestResults();
    }
  }, [userData]);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/test-series/results`, {
        withCredentials: true
      });

      if (response.data.success) {
        setResults(response.data.results);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.error('Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const fetchResultDetails = async (attemptId) => {
    try {
      const response = await axios.get(`${serverUrl}/api/test-series/result/${attemptId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setSelectedResult(response.data.result);
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching result details:', error);
      toast.error('Failed to load result details');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) return { text: 'Excellent', color: 'bg-transparent border border-gray-200 text-green-800' };
    if (percentage >= 80) return { text: 'Good', color: 'bg-transparent border border-gray-200text-blue-800' };
    if (percentage >= 60) return { text: 'Average', color: 'bg-transparent border border-gray-200 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-transparent border border-gray-200 text-red-800' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test results...</p>
        </div>
      </div>
    );
  }

  if (showDetails && selectedResult) {
    return (
      <div className="p-6 bg-transparent border border-gray-200 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(false)}
              className="text-white flex items-center space-x-2"
            >
              <span>← Back to Results</span>
            </button>
          </div>

          {/* Test Details Header */}
          <div className="bg-transparent border border-gray-200 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedResult.test.subject}</h1>
                <p className="text-white">Chapter: {selectedResult.test.chapter} | Topic: {selectedResult.test.topic}</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getPerformanceColor(selectedResult.percentage)}`}>
                  {selectedResult.percentage}%
                </div>
                <div className="text-sm text-white">
                  {selectedResult.score}/{selectedResult.totalQuestions} correct
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-transparent border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaClock className="text-blue-600" />
                  <span className="text-sm font-medium text-white">Time Spent</span>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {formatTime(selectedResult.timeSpent)}
                </div>
              </div>
              <div className="bg-transparent border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm font-medium text-white">Correct</span>
                </div>
                <div className="text-xl font-bold text-green-600">
                  {selectedResult.score}
                </div>
              </div>
              <div className="bg-transparent border border-gray-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaTimesCircle className="text-red-600" />
                  <span className="text-sm font-medium text-white">Incorrect</span>
                </div>
                <div className="text-xl font-bold text-red-600">
                  {selectedResult.totalQuestions - selectedResult.score}
                </div>
              </div>
            </div>
          </div>

          {/* Question Analysis */}
          <div className="bg-transparent border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold white mb-6">Question Analysis</h2>
            <div className="space-y-6">
              {selectedResult.questionAnalysis.map((question, index) => (
                <div key={index} className={`border-l-4 pl-4 ${
                  question.isCorrect ? 'border-green-500 bg-transparent' : 'border-red-500 bg-transparent'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white">
                      Q{question.questionNumber}: {question.questionText}
                    </h3>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${
                      question.isCorrect 
                        ? 'bg-transparent border border-gray-200 text-green-800' 
                        : 'bg-transparent border border-gray-200 text-red-800'
                    }`}>
                      {question.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Your Answer:</span> {question.selectedAnswer}</p>
                    <p><span className="font-medium">Correct Answer:</span> {question.correctAnswer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Test Results</h2>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-transparent border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3">
                <FaChartLine className="text-blue-600 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Attempts</h3>
                  <p className="text-2xl font-bold text-blue-600">{summary.totalAttempts}</p>
                </div>
              </div>
            </div>
            <div className="bg-transparent border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3">
                <FaTrophy className="text-yellow-600 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Average Score</h3>
                  <p className="text-2xl font-bold text-yellow-600">{summary.averageScore}%</p>
                </div>
              </div>
            </div>
            <div className="bg-transparent border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Best Score</h3>
                  <p className="text-2xl font-bold text-green-600">{summary.bestScore}%</p>
                </div>
              </div>
            </div>
            <div className="bg-transparent border border-gray-200 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3">
                <FaClock className="text-purple-600 text-2xl" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Time Spent</h3>
                  <p className="text-2xl font-bold text-purple-600">{formatTime(summary.totalTimeSpent)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="bg-transparent border border-gray-200 rounded-lg shadow-md p-12 text-center">
            <FaChartLine className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Test Results Yet</h3>
            <p className="text-white">Take some tests to see your results here!</p>
          </div>
        ) : (
          <div className="bg-transparent border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Test History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-transparent border border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Test Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent border border-gray-200 divide-y divide-gray-200">
                  {results.map((result) => {
                    const badge = getPerformanceBadge(result.percentage);
                    return (
                      <tr key={result._id} className="">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {result.test.subject}
                            </div>
                            <div className="text-sm text-white">
                              {result.test.chapter} - {result.test.topic}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            <span className={`font-bold ${getPerformanceColor(result.percentage)}`}>
                              {result.score}/{result.totalQuestions}
                            </span>
                          </div>
                          <div className={`text-sm font-medium ${getPerformanceColor(result.percentage)}`}>
                            {result.percentage}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatTime(result.timeSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-white" />
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.color}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => fetchResultDetails(result._id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <FaEye />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;