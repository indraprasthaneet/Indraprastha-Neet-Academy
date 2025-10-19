import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaList, FaAlignLeft, FaPlay } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

function QuestionChapterPage() {
  const { classNumber, subject, chapter } = useParams();
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [objectiveQuestions, setObjectiveQuestions] = useState([]);
  const [subjectiveQuestions, setSubjectiveQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('objective');
  const [loading, setLoading] = useState(true);

  // Decode URL parameters
  const decodedSubject = decodeURIComponent(subject);
  const decodedChapter = decodeURIComponent(chapter);

  useEffect(() => {
    fetchQuestions();
  }, [classNumber, decodedSubject, decodedChapter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Fetch objective questions
      const objectiveResponse = await axios.get(`${serverUrl}/api/questions`, {
        params: {
          class: classNumber,
          subject: decodedSubject,
          chapter: decodedChapter,
          questionType: 'objective'
        }
      });
      
      // Fetch subjective questions
      const subjectiveResponse = await axios.get(`${serverUrl}/api/questions`, {
        params: {
          class: classNumber,
          subject: decodedSubject,
          chapter: decodedChapter,
          questionType: 'subjective'
        }
      });
      
      if (objectiveResponse.data.success) {
        setObjectiveQuestions(objectiveResponse.data.questions);
      }
      
      if (subjectiveResponse.data.success) {
        setSubjectiveQuestions(subjectiveResponse.data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPlayground = (questionId) => {
    navigate(`/playground/${questionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <ClipLoader size={50} color="#FFD700" />
          <p className="text-gray-300 mt-4">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
                {decodedSubject} - {decodedChapter}
              </h1>
              <p className="text-gray-400">
                Class {classNumber} Question Bank
              </p>
            </div>
          </div>
        </div>

        {/* For Students: Show only questions with Go to Playground button */}
        {userData && userData.role === 'student' ? (
          <div>
            {/* Objective Questions for Students */}
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FaList className="mr-2 text-[#FFD700]" />
              Objective Questions
            </h2>
            
            {objectiveQuestions.length === 0 ? (
              <div className="bg-[#1e1e1e] rounded-xl p-8 text-center border border-gray-700">
                <p className="text-gray-400 text-lg">
                  No objective questions available for this chapter.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {objectiveQuestions.map((question, index) => (
                  <div key={question._id} className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Q{index + 1}. {question.questionText}
                      </h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        Objective
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex}
                          className="p-3 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-gray-300 mr-3">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="text-gray-200">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleGoToPlayground(question._id)}
                        className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors flex items-center"
                      >
                        <FaPlay className="mr-2" />
                        Go to Playground
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subjective Questions for Students */}
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center mt-12">
              <FaAlignLeft className="mr-2 text-[#FFD700]" />
              Subjective Questions
            </h2>
            
            {subjectiveQuestions.length === 0 ? (
              <div className="bg-[#1e1e1e] rounded-xl p-8 text-center border border-gray-700">
                <p className="text-gray-400 text-lg">
                  No subjective questions available for this chapter.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {subjectiveQuestions.map((question, index) => (
                  <div key={question._id} className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Q{index + 1}. {question.questionText}
                      </h3>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        Subjective
                      </span>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleGoToPlayground(question._id)}
                        className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors flex items-center"
                      >
                        <FaPlay className="mr-2" />
                        Go to Playground
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* For Educators: Show full management options */
          <div>
            {/* Tab Navigation for Educators */}
            <div className="flex space-x-1 bg-[#1e1e1e] p-1 rounded-lg mb-8 w-fit">
              <button
                onClick={() => setActiveTab('objective')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'objective'
                    ? 'bg-[#FFD700] text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Objective Questions ({objectiveQuestions.length})
              </button>
              <button
                onClick={() => setActiveTab('subjective')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'subjective'
                    ? 'bg-[#FFD700] text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Subjective Questions ({subjectiveQuestions.length})
              </button>
            </div>

            {/* Objective Questions Tab for Educators */}
            {activeTab === 'objective' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <FaList className="mr-2 text-[#FFD700]" />
                  Objective Questions
                </h2>
                
                {objectiveQuestions.length === 0 ? (
                  <div className="bg-[#1e1e1e] rounded-xl p-8 text-center border border-gray-700">
                    <p className="text-gray-400 text-lg">
                      No objective questions added yet. Add your first question!
                    </p>
                    <button
                      onClick={() => navigate('/question-bank?class=' + classNumber)}
                      className="mt-4 px-6 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors font-medium"
                    >
                      Add Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {objectiveQuestions.map((question, index) => (
                      <div key={question._id} className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-white">
                            Q{index + 1}. {question.questionText}
                          </h3>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                            Objective
                          </span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                option === question.correctAnswer
                                  ? 'border-green-500 bg-green-500/10'
                                  : 'border-gray-600'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="font-medium text-gray-300 mr-3">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span className="text-gray-200">{option}</span>
                                {option === question.correctAnswer && (
                                  <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                                    Correct
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleGoToPlayground(question._id)}
                            className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors flex items-center"
                          >
                            <FaPlay className="mr-2" />
                            Go to Playground
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subjective Questions Tab for Educators */}
            {activeTab === 'subjective' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <FaAlignLeft className="mr-2 text-[#FFD700]" />
                  Subjective Questions
                </h2>
                
                {subjectiveQuestions.length === 0 ? (
                  <div className="bg-[#1e1e1e] rounded-xl p-8 text-center border border-gray-700">
                    <p className="text-gray-400 text-lg">
                      No subjective questions added yet. Add your first question!
                    </p>
                    <button
                      onClick={() => navigate('/question-bank?class=' + classNumber)}
                      className="mt-4 px-6 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors font-medium"
                    >
                      Add Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subjectiveQuestions.map((question, index) => (
                      <div key={question._id} className="bg-[#1e1e1e] rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-white">
                            Q{index + 1}. {question.questionText}
                          </h3>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                            Subjective
                          </span>
                        </div>
                        
                        <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
                          <p className="text-sm font-medium text-gray-300 mb-2">Sample Answer:</p>
                          <p className="text-gray-200">{question.answerText}</p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleGoToPlayground(question._id)}
                            className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#ffed4e] transition-colors flex items-center"
                          >
                            <FaPlay className="mr-2" />
                            Go to Playground
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionChapterPage;