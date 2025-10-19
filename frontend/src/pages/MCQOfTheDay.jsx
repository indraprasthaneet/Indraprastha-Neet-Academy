import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { FaArrowLeft, FaBookOpen, FaPlus, FaTimes, FaCheck, FaCalendarAlt, FaClock, FaPlayCircle, FaLink, FaTrash, FaVideo, FaImage, FaUpload } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import VideoSolutionModal from '../components/VideoSolutionModal';

const MCQOfTheDay = () => {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  
  // Educator states
  const [formData, setFormData] = useState({
    subject: '',
    chapter: '',
    topic: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    videoLink: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdMcqs, setCreatedMcqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [canSubmitMcq, setCanSubmitMcq] = useState(true);
  const [showVideoInput, setShowVideoInput] = useState({});
  const [videoLinkInput, setVideoLinkInput] = useState({});
  const [addingVideoLink, setAddingVideoLink] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState({});
  const [showImageInput, setShowImageInput] = useState({});
  const [imageInput, setImageInput] = useState({});
  
  // Filter MCQs based on search term
  const filteredMcqs = useMemo(() => {
    if (!searchTerm) return createdMcqs;
    
    return createdMcqs.filter(mcq => 
      mcq.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcq.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcq.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mcq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [createdMcqs, searchTerm]);
  
  // Student states
  const [todayMcq, setTodayMcq] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showVideoSolution, setShowVideoSolution] = useState(false);
  
  // Memoize the formatTime function to prevent unnecessary re-renders
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);
  
  // YouTube URL validation function
  const isValidYouTubeUrl = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      const host = urlObj.hostname;
      const pathname = urlObj.pathname;
      const searchParams = urlObj.searchParams;
      
      // Check if it's a YouTube domain (allow both http and https, with or without www)
      if (!host.includes('youtube.com') && !host.includes('youtu.be')) {
        return false;
      }
      
      // For youtu.be short URLs
      if (host.includes('youtu.be') && pathname.length > 1) {
        return true;
      }
      
      // For youtube.com URLs, check if it has a video parameter
      if (host.includes('youtube.com') && pathname === '/watch' && searchParams.has('v')) {
        return true;
      }
      
      // For embedded youtube.com URLs
      if (host.includes('youtube.com') && pathname.startsWith('/embed/')) {
        return true;
      }
      
      return false;
    } catch {
      // If URL parsing fails, it's not a valid URL
      return false;
    }
  }, []);
  
  // Handle image selection for new MCQ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle image selection for existing MCQ
  const handleImageChangeForMcq = (mcqId, e) => {
    const file = e.target.files[0];
    if (file) {
      setImageInput(prev => ({ ...prev, [mcqId]: file }));
    }
  };
  
  // Timer effect for students - optimized to prevent flickering
  useEffect(() => {
    let interval = null;
    
    if (timerActive && todayMcq && !todayMcq.isAttempted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, todayMcq]);
  
  // Fetch today's MCQ for students - memoized to prevent unnecessary calls
  const fetchTodayMcq = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/mcq/today`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setTodayMcq(response.data.mcq);
        // Start timer if MCQ exists and not attempted
        if (response.data.mcq && !response.data.mcq.isAttempted) {
          setTimeSpent(response.data.mcq.timeSpent || 0);
          setTimerActive(true);
        } else {
          setTimerActive(false);
        }
      }
    } catch (error) {
      console.error('Error fetching today\'s MCQ:', error);
      toast.error('Error fetching MCQ');
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);
  
  // Fetch created MCQs for educators - memoized to prevent unnecessary calls
  const fetchCreatedMcqs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/mcq/educator`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setCreatedMcqs(response.data.mcqs);
      }
    } catch (error) {
      console.error('Error fetching created MCQs:', error);
      toast.error('Error fetching MCQs');
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);
  
  // Check submission eligibility - memoized to prevent unnecessary calls
  const checkSubmissionEligibility = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/mcq/can-submit`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setCanSubmitMcq(response.data.canSubmit);
      }
    } catch (error) {
      console.error('Error checking submission eligibility:', error);
    }
  }, [serverUrl]);
  
  // Handle form input changes for educators
  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);
  
  // Handle option changes for educators
  const handleOptionChange = useCallback((index, value) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return {
        ...prev,
        options: newOptions
      };
    });
  }, []);
  
  // Add new option for educators
  const addOption = useCallback(() => {
    setFormData(prev => {
      if (prev.options.length < 6) {
        return {
          ...prev,
          options: [...prev.options, '']
        };
      }
      return prev;
    });
  }, []);
  
  // Remove option for educators
  const removeOption = useCallback((index) => {
    setFormData(prev => {
      if (prev.options.length > 4) {
        const newOptions = prev.options.filter((_, i) => i !== index);
        return {
          ...prev,
          options: newOptions
        };
      }
      return prev;
    });
  }, []);
  
  // Handle MCQ submission for educators
  const handleSubmitMcq = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create form data to handle file upload
      const mcqData = new FormData();
      mcqData.append('subject', formData.subject);
      mcqData.append('chapter', formData.chapter);
      mcqData.append('topic', formData.topic);
      mcqData.append('question', formData.question);
      mcqData.append('options', JSON.stringify(formData.options));
      mcqData.append('correctAnswer', formData.correctAnswer);
      mcqData.append('videoLink', formData.videoLink);
      
      // Add image if selected
      if (selectedImage) {
        mcqData.append('image', selectedImage);
      }
      
      const response = await axios.post(`${serverUrl}/api/mcq/create`, mcqData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('MCQ created successfully!');
        setFormData({
          subject: '',
          chapter: '',
          topic: '',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          videoLink: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
        fetchCreatedMcqs();
        checkSubmissionEligibility();
      }
    } catch (error) {
      console.error('Error creating MCQ:', error);
      toast.error(error.response?.data?.message || 'Error creating MCQ');
    } finally {
      setSubmitting(false);
    }
  }, [formData, selectedImage, serverUrl, fetchCreatedMcqs, checkSubmissionEligibility]);
  
  // Handle image upload for existing MCQ
  const handleUploadImage = useCallback(async (mcqId) => {
    const imageFile = imageInput[mcqId];
    if (!imageFile) return;
    
    setUploadingImage(prev => ({ ...prev, [mcqId]: true }));
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axios.post(`${serverUrl}/api/mcq/upload-image/${mcqId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toast.success('Image uploaded successfully!');
        setShowImageInput(prev => ({ ...prev, [mcqId]: false }));
        setImageInput(prev => ({ ...prev, [mcqId]: null }));
        fetchCreatedMcqs();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Error uploading image');
    } finally {
      setUploadingImage(prev => ({ ...prev, [mcqId]: false }));
    }
  }, [imageInput, serverUrl, fetchCreatedMcqs]);
  
  // Handle image removal for existing MCQ
  const handleRemoveImage = useCallback(async (mcqId) => {
    setUploadingImage(prev => ({ ...prev, [mcqId]: true }));
    
    try {
      const response = await axios.delete(`${serverUrl}/api/mcq/remove-image/${mcqId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Image removed successfully!');
        fetchCreatedMcqs();
      }
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(error.response?.data?.message || 'Error removing image');
    } finally {
      setUploadingImage(prev => ({ ...prev, [mcqId]: false }));
    }
  }, [serverUrl, fetchCreatedMcqs]);
  
  // Handle answer submission for students
  const handleSubmitAnswer = useCallback(async () => {
    if (!selectedAnswer || !todayMcq) return;
    
    setSubmitting(true);
    setTimerActive(false); // Stop the timer
    
    try {
      const response = await axios.post(`${serverUrl}/api/mcq/submit`, {
        mcqId: todayMcq._id,
        selectedAnswer,
        timeSpent
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Answer submitted successfully!');
        // Refresh to show the result
        await fetchTodayMcq();
        // Don't redirect - show the result with buttons
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error(error.response?.data?.message || 'Error submitting answer');
      setTimerActive(true); // Restart timer if submission failed
    } finally {
      setSubmitting(false);
    }
  }, [selectedAnswer, todayMcq, timeSpent, serverUrl, fetchTodayMcq, navigate]);
  
  // Handle video link operations for educators
  const handleAddVideoLink = useCallback(async (mcqId) => {
    const videoLink = videoLinkInput[mcqId];
    if (!videoLink) return;
    
    // Validate YouTube URL
    if (!isValidYouTubeUrl(videoLink)) {
      toast.error('Please provide a valid YouTube URL');
      return;
    }
    
    setAddingVideoLink(prev => ({ ...prev, [mcqId]: true }));
    
    try {
      const response = await axios.post(`${serverUrl}/api/mcq/add-video-link`, {
        mcqId,
        videoLink
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Video link added successfully!');
        setShowVideoInput(prev => ({ ...prev, [mcqId]: false }));
        setVideoLinkInput(prev => ({ ...prev, [mcqId]: '' }));
        fetchCreatedMcqs();
      }
    } catch (error) {
      console.error('Error adding video link:', error);
      toast.error(error.response?.data?.message || 'Error adding video link');
    } finally {
      setAddingVideoLink(prev => ({ ...prev, [mcqId]: false }));
    }
  }, [videoLinkInput, serverUrl, fetchCreatedMcqs]);
  
  const handleRemoveVideoLink = useCallback(async (mcqId) => {
    setAddingVideoLink(prev => ({ ...prev, [mcqId]: true }));
    
    try {
      const response = await axios.delete(`${serverUrl}/api/mcq/remove-video/${mcqId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('Video link removed successfully!');
        fetchCreatedMcqs();
      }
    } catch (error) {
      console.error('Error removing video link:', error);
      toast.error(error.response?.data?.message || 'Error removing video link');
    } finally {
      setAddingVideoLink(prev => ({ ...prev, [mcqId]: false }));
    }
  }, [serverUrl, fetchCreatedMcqs]);
  
  // Fetch data based on user role - using useCallback to prevent unnecessary re-renders
  useEffect(() => {
    if (userData?.role === 'student') {
      fetchTodayMcq();
    } else if (userData?.role === 'educator') {
      fetchCreatedMcqs();
      checkSubmissionEligibility();
    }
  }, [userData, fetchTodayMcq, fetchCreatedMcqs, checkSubmissionEligibility]);
  
  // If user data is not loaded, show loading state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center text-gray-100">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }
  
  // Educator View
  if (userData?.role === 'educator') {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <FaArrowLeft 
              className="w-6 h-6 cursor-pointer text-gray-300 hover:text-white mr-4" 
              onClick={() => navigate('/')} 
            />
            <div>
              <h1 className="text-3xl font-bold text-white">MCQ of the Day</h1>
              <p className="text-gray-400 mt-1">Create and manage daily MCQs</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Create MCQ Form */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <FaBookOpen className="mr-2 text-blue-400" />
                Create New MCQ
              </h2>
              
              {!canSubmitMcq ? (
                <div className="bg-yellow-900 border border-yellow-800 rounded-lg p-4 mb-6 text-yellow-200">
                  <p>
                    You can only submit one MCQ of the Day every 24 hours. Please try again later.
                  </p>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmitMcq} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject"
                    disabled={!canSubmitMcq}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Chapter</label>
                    <input
                      type="text"
                      name="chapter"
                      value={formData.chapter}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter chapter"
                      disabled={!canSubmitMcq}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter topic"
                      disabled={!canSubmitMcq}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your question"
                    disabled={!canSubmitMcq}
                    required
                  />
                </div>
                
                {/* Image Upload for New MCQ */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Question Image (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FaUpload className="w-8 h-8 text-gray-400" />
                          <p className="text-xs text-gray-400">Click to upload</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        disabled={!canSubmitMcq}
                      />
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedImage(null);
                        }}
                        className="px-3 py-1 text-red-400 border border-red-600 rounded hover:bg-red-900"
                        disabled={!canSubmitMcq}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Upload an image to accompany your question (max 5MB)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                          disabled={!canSubmitMcq}
                          required
                        />
                        {formData.options.length > 4 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-400 hover:bg-red-900 rounded-lg ml-2"
                            disabled={!canSubmitMcq}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {formData.options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-2 px-4 py-2 text-blue-300 border border-blue-600 rounded-lg hover:bg-blue-900 flex items-center"
                      disabled={!canSubmitMcq}
                    >
                      <FaPlus className="mr-2" />
                      Add Option
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer</label>
                  <select
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!canSubmitMcq}
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
                
                {/* YouTube Video Link Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">YouTube Video Link</label>
                  <input
                    type="url"
                    name="videoLink"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.youtube.com/watch?v=..."
                    disabled={!canSubmitMcq}
                  />
                  <p className="mt-1 text-xs text-gray-400">Optional: Add a YouTube solution video for students</p>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !canSubmitMcq}
                  className={`w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center ${
                    canSubmitMcq
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? <ClipLoader size={20} color="#ffffff" /> : 'Create MCQ'}
                </button>
              </form>
            </div>
            
            {/* Created MCQs List */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <FaBookOpen className="mr-2 text-green-400" />
                Your Created MCQs
              </h2>
              
              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search MCQs by subject, chapter, topic, or question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <ClipLoader size={40} color="#3B82F6" />
                </div>
              ) : filteredMcqs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-lg">
                    {searchTerm ? 'No matching MCQs found' : 'No MCQs created yet'}
                  </p>
                  <p className="text-sm mt-2">
                    {searchTerm ? 'Try different search terms' : 'Create your first MCQ using the form'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMcqs.map((mcq) => (
                    <div key={mcq._id} className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{mcq.subject}</h3>
                        <span className="text-xs text-gray-400">
                          {new Date(mcq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        <span className="font-medium text-gray-300">Chapter:</span> {mcq.chapter} | 
                        <span className="font-medium text-gray-300"> Topic:</span> {mcq.topic}
                      </p>
                      <p className="text-sm text-gray-200 mb-3 break-words overflow-wrap-anywhere">{mcq.question}</p>
                      
                      {/* Display Image if exists */}
                      {mcq.imageUrl && (
                        <div className="mb-3">
                          <img 
                            src={`${serverUrl}${mcq.imageUrl}`} 
                            alt="MCQ" 
                            className="max-w-full h-auto rounded-lg border border-gray-700"
                          />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 gap-1">
                        {mcq.options.map((option, index) => (
                          <div key={index} className={`text-xs p-2 rounded ${
                            option === mcq.correctAnswer 
                              ? 'bg-green-900 text-green-300 font-medium' 
                              : 'bg-gray-700 text-gray-200'
                          }`}>
                            {option === mcq.correctAnswer && <FaCheck className="inline mr-1" />}
                            {option}
                          </div>
                        ))}
                      </div>
                      
                      {/* Image Management */}
                      <div className="mt-4 pt-3 border-t border-gray-700">
                        {mcq.imageUrl ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-green-300">
                              <FaImage className="mr-2" />
                              <span className="text-sm font-medium text-green-300">Image Added</span>
                            </div>
                            <button
                              onClick={() => handleRemoveImage(mcq._id)}
                              disabled={uploadingImage[mcq._id]}
                              className="flex items-center px-2 py-1 text-red-400 hover:bg-red-900 rounded transition-colors disabled:opacity-50"
                            >
                              {uploadingImage[mcq._id] ? (
                                <ClipLoader size={12} color="#dc2626" />
                              ) : (
                                <>
                                  <FaTrash className="mr-1" />
                                  <span className="text-xs">Remove</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div>
                            {showImageInput[mcq._id] ? (
                              <div className="space-y-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageChangeForMcq(mcq._id, e)}
                                  className="w-full p-2 text-xs border border-gray-600 rounded bg-gray-900 text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  disabled={!canSubmitMcq}
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUploadImage(mcq._id)}
                                    disabled={uploadingImage[mcq._id] || !imageInput[mcq._id] || !canSubmitMcq}
                                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                                  >
                                    {uploadingImage[mcq._id] ? (
                                      <ClipLoader size={12} color="#ffffff" />
                                    ) : (
                                      <>
                                        <FaCheck className="mr-1" />
                                        Upload
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setShowImageInput(prev => ({ ...prev, [mcq._id]: false }))}
                                    className="px-3 py-1 text-gray-300 text-xs rounded hover:bg-gray-700 transition-colors"
                                    disabled={!canSubmitMcq}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowImageInput(prev => ({ ...prev, [mcq._id]: true }))}
                                className="flex items-center px-3 py-2 text-blue-300 border border-blue-600 rounded hover:bg-blue-900 transition-colors"
                                disabled={!canSubmitMcq}
                              >
                                <FaImage className="mr-2" />
                                <span className="text-sm">Add Image</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Video Link Management */}
                      <div className="mt-4 pt-3 border-t border-gray-700">
                        {mcq.videoLink ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-green-300">
                              <FaVideo className="mr-2" />
                              <span className="text-sm font-medium text-green-300">Video Solution Added</span>
                            </div>
                            <button
                              onClick={() => handleRemoveVideoLink(mcq._id)}
                              disabled={addingVideoLink[mcq._id]}
                              className="flex items-center px-2 py-1 text-red-400 hover:bg-red-900 rounded transition-colors disabled:opacity-50"
                            >
                              {addingVideoLink[mcq._id] ? (
                                <ClipLoader size={12} color="#dc2626" />
                              ) : (
                                <>
                                  <FaTrash className="mr-1" />
                                  <span className="text-xs">Remove</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div>
                            {showVideoInput[mcq._id] ? (
                              <div className="space-y-2">
                                <input
                                  type="url"
                                  value={videoLinkInput[mcq._id] || ''}
                                  onChange={(e) => setVideoLinkInput(prev => ({ ...prev, [mcq._id]: e.target.value }))}
                                  placeholder="Enter YouTube video URL"
                                  className="w-full p-2 text-xs border border-gray-600 rounded bg-gray-900 text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  disabled={!canSubmitMcq}
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAddVideoLink(mcq._id)}
                                    disabled={addingVideoLink[mcq._id] || !canSubmitMcq}
                                    className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                                  >
                                    {addingVideoLink[mcq._id] ? (
                                      <ClipLoader size={12} color="#ffffff" />
                                    ) : (
                                      <>
                                        <FaCheck className="mr-1" />
                                        Add
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setShowVideoInput(prev => ({ ...prev, [mcq._id]: false }))}
                                    className="px-3 py-1 text-gray-300 text-xs rounded hover:bg-gray-700 transition-colors"
                                    disabled={!canSubmitMcq}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowVideoInput(prev => ({ ...prev, [mcq._id]: true }))}
                                className="flex items-center px-3 py-2 text-blue-300 border border-blue-600 rounded hover:bg-blue-900 transition-colors"
                                disabled={!canSubmitMcq}
                              >
                                <FaLink className="mr-2" />
                                <span className="text-sm">Add YouTube Link</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Student View
  if (userData?.role === 'student') {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <FaArrowLeft 
              className="w-6 h-6 cursor-pointer text-gray-300 hover:text-white mr-4" 
              onClick={() => navigate('/')} 
            />
            <div>
              <h1 className="text-3xl font-bold text-white">MCQ of the Day</h1>
              <p className="text-gray-400 mt-1">Test your knowledge with today's question</p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ClipLoader size={50} color="#3B82F6" />
            </div>
          ) : !todayMcq ? (
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 text-center">
              <FaCalendarAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">No MCQ Available</h2>
              <p className="text-gray-400">Check back later for today's question!</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
              {/* Timer Display */}
              {!todayMcq.isAttempted && (
                <div className="mb-6 p-4 bg-blue-900 rounded-lg flex items-center justify-between text-blue-200">
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>Time Spent: {formatTime(timeSpent)}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              )}
              
              {/* MCQ Details */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-4">
                  <span className="bg-gray-700 px-2 py-1 rounded text-gray-200">{todayMcq.subject}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-gray-200">{todayMcq.chapter}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded text-gray-200">{todayMcq.topic}</span>
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-6 break-words overflow-wrap-anywhere">{todayMcq.question}</h2>
                
                {/* Display Image if exists */}
                  {todayMcq.imageUrl && (
                    <div className="mb-6 flex justify-center">
                      <img 
                        src={`${serverUrl}${todayMcq.imageUrl}`} 
                        alt="MCQ" 
                        className="max-w-md w-full h-auto rounded-lg border border-gray-700 shadow-sm"
                      />
                    </div>
                  )}
                
                {todayMcq.isAttempted ? (
                  <div className={`p-4 rounded-lg mb-6 ${
                    todayMcq.studentResponse.isCorrect 
                      ? 'bg-green-900 border border-green-700 text-green-200' 
                      : 'bg-red-900 border border-red-700 text-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        todayMcq.studentResponse.isCorrect 
                          ? 'text-green-200' 
                          : 'text-red-200'
                      }`}>
                        {todayMcq.studentResponse.isCorrect ? 'Correct!' : 'Incorrect!'}
                      </span>
                      <span className="text-sm text-gray-400">
                        Submitted on {new Date(todayMcq.studentResponse.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Your answer: <span className="font-medium break-words overflow-wrap-anywhere">{todayMcq.studentResponse.selectedAnswer}</span></p>
                      {!todayMcq.studentResponse.isCorrect && (
                        <p>Correct answer: <span className="font-medium text-green-300 break-words overflow-wrap-anywhere">{todayMcq.correctAnswer}</span></p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {todayMcq.options.map((option, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedAnswer(option)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAnswer === option
                            ? 'border-blue-500 bg-blue-800 text-white'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800 text-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            selectedAnswer === option
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-600 bg-gray-800'
                          }`}>
                            {selectedAnswer === option && (
                              <FaCheck className="text-white text-xs" />
                            )}
                          </div>
                          <span className="break-words overflow-wrap-anywhere">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {!todayMcq.isAttempted ? (
                  <>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer || submitting}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                        selectedAnswer && !submitting
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <ClipLoader size={16} color="#ffffff" />
                          <span className="ml-2">Submitting...</span>
                        </>
                      ) : (
                        'Submit Answer'
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedAnswer('')}
                      disabled={!selectedAnswer}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        selectedAnswer
                          ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Clear Selection
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Go to Home
                    </button>
                    {todayMcq.videoLink && (
                      <button
                        onClick={() => window.open(todayMcq.videoLink, '_blank')}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <FaPlayCircle className="mr-2" />
                        Go to YouTube Solution
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {/* Video Solution Modal */}
              <VideoSolutionModal 
                isOpen={showVideoSolution}
                onClose={() => setShowVideoSolution(false)}
                videoUrl={todayMcq?.videoLink}
                questionText={todayMcq?.question}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Redirect to login if no user data
  return null;
};

export default MCQOfTheDay;