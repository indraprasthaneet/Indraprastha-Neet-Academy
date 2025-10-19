import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';

const AddQuestionModal = ({ isOpen, onClose, classNumber, questionBankChapters }) => {
  const [step, setStep] = useState(1); // 1: Select type, 2: Add question
  const [questionType, setQuestionType] = useState('');
  const [formData, setFormData] = useState({
    class: classNumber,
    subject: '',
    chapter: '',
    questionText: '',
    options: ['', ''],
    correctAnswer: '',
    answerText: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const subjects = Object.keys(questionBankChapters[`class${classNumber}`] || {});
  const chapters = formData.subject 
    ? questionBankChapters[`class${classNumber}`][formData.subject] || []
    : [];

  const handleTypeSelect = (type) => {
    setQuestionType(type);
    setStep(2);
    
    // Reset form data for the selected type
    setFormData({
      class: classNumber,
      subject: '',
      chapter: '',
      questionText: '',
      options: type === 'objective' ? ['', ''] : [],
      correctAnswer: '',
      answerText: type === 'subjective' ? '' : ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.subject || !formData.chapter || !formData.questionText) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      if (questionType === 'objective') {
        if (formData.options.length < 2) {
          toast.error('Objective questions must have at least 2 options');
          setSubmitting(false);
          return;
        }

        if (!formData.correctAnswer) {
          toast.error('Please select the correct answer');
          setSubmitting(false);
          return;
        }

        if (!formData.options.includes(formData.correctAnswer)) {
          toast.error('Correct answer must be one of the provided options');
          setSubmitting(false);
          return;
        }
      } else if (questionType === 'subjective') {
        if (!formData.answerText) {
          toast.error('Please provide the answer text');
          setSubmitting(false);
          return;
        }
      }

      const questionData = {
        class: formData.class,
        subject: formData.subject,
        chapter: formData.chapter,
        questionText: formData.questionText,
        questionType,
        options: questionType === 'objective' ? formData.options.filter(opt => opt.trim() !== '') : undefined,
        correctAnswer: questionType === 'objective' ? formData.correctAnswer : undefined,
        answerText: questionType === 'subjective' ? formData.answerText : undefined
      };

      const response = await axios.post(`${serverUrl}/api/questions`, questionData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Question added successfully!');
        onClose();
        // Reset form
        setStep(1);
        setQuestionType('');
        setFormData({
          class: classNumber,
          subject: '',
          chapter: '',
          questionText: '',
          options: ['', ''],
          correctAnswer: '',
          answerText: ''
        });
      }
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error(error.response?.data?.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {step === 1 ? 'Add New Question' : `Add ${questionType === 'objective' ? 'Objective' : 'Subjective'} Question`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Select question type
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Select Question Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleTypeSelect('objective')}
                  className="p-6 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                >
                  <h4 className="font-semibold text-blue-700 mb-2">Objective Question</h4>
                  <p className="text-sm text-gray-600">Multiple choice questions with options</p>
                </button>
                <button
                  onClick={() => handleTypeSelect('subjective')}
                  className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left"
                >
                  <h4 className="font-semibold text-green-700 mb-2">Subjective Question</h4>
                  <p className="text-sm text-gray-600">Open-ended questions with text answers</p>
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Add question form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                  <select
                    name="chapter"
                    value={formData.chapter}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={!formData.subject}
                  >
                    <option value="">Select Chapter</option>
                    {chapters.map((chapter) => (
                      <option key={chapter} value={chapter}>{chapter}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                <textarea
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your question"
                  required
                />
              </div>
              
              {questionType === 'objective' ? (
                // Objective question fields
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="space-y-3">
                      {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Option ${index + 1}`}
                            required
                          />
                          {formData.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {formData.options.length < 6 && (
                      <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Add Option
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                    <select
                      name="correctAnswer"
                      value={formData.correctAnswer}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select correct answer</option>
                      {formData.options
                        .filter(option => option.trim() !== '')
                        .map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              ) : (
                // Subjective question fields
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer Text</label>
                  <textarea
                    name="answerText"
                    value={formData.answerText}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter the answer to this question"
                    required
                  />
                </div>
              )}
              
              {/* Form Actions */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <ClipLoader size={16} color="#ffffff" />
                      <span className="ml-2">Adding...</span>
                    </>
                  ) : (
                    'Add Question'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;