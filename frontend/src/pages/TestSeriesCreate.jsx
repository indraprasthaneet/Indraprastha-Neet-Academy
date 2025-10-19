import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { serverUrl } from "../App";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const TestSeriesCreate = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    chapter: "",
    topic: "",
    questions: [
      {
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ],
  });

  // Created tests state
  const [createdTests, setCreatedTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if user is educator
  useEffect(() => {
    if (!userData || userData.role !== "educator") {
      toast.error("Only educators can create tests");
      navigate("/test-series");
      return;
    }
    fetchCreatedTests();
  }, [userData, navigate]);

  // Fetch tests created by this educator
  const fetchCreatedTests = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/test-series/educator`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setCreatedTests(response.data.tests);
      }
    } catch (error) {
      console.error("Error fetching created tests:", error);
      toast.error("Error fetching your tests");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle question text change
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].text = value;
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Handle option change
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Add new question
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    }));
  };

  // Remove question
  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
    }
  };

  // Add option to question
  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push("");
    setFormData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  // Remove option from question
  const removeOption = (questionIndex, optionIndex) => {
    if (formData.questions[questionIndex].options.length > 2) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setFormData((prev) => ({
        ...prev,
        questions: updatedQuestions,
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.subject || !formData.chapter || !formData.topic) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const question = formData.questions[i];
      if (!question.text) {
        toast.error(`Question ${i + 1} text is required`);
        setLoading(false);
        return;
      }
      if (question.options.some((option) => !option.trim())) {
        toast.error(`All options for question ${i + 1} must be filled`);
        setLoading(false);
        return;
      }
      if (!question.correctAnswer) {
        toast.error(`Correct answer for question ${i + 1} is required`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/test-series/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Test created successfully!");
        // Reset form
        setFormData({
          subject: "",
          chapter: "",
          topic: "",
          questions: [
            {
              text: "",
              options: ["", "", "", ""],
              correctAnswer: "",
            },
          ],
        });
        // Refresh created tests list
        fetchCreatedTests();
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error(error.response?.data?.message || "Error creating test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 py-15 bg-[#121212] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Create Test Series
        </h1>

        {/* Create Test Form */}
        <div className="bg-[#1e1e1e] rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">New Test</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Subject Name *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chapter Name *
                </label>
                <input
                  type="text"
                  name="chapter"
                  value={formData.chapter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Algebra"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Topic Name *
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Linear Equations"
                  required
                />
              </div>
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Questions</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-300 text-black rounded-md hover:bg-green-600 transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              {formData.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="border text-white border-gray-200 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">
                      Question {questionIndex + 1}
                    </h4>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4 text-white">
                    <label className="block text-sm font-medium text-white mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, e.target.value)
                      }
                      className="w-full px-3 py-2 border text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Enter your question here..."
                      required
                    />
                  </div>

                  {/* Options */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white">
                        Options *
                      </label>
                      <button
                        type="button"
                        onClick={() => addOption(questionIndex)}
                        className="text-sm text-white rounded-2xl bg-blue-400 px-2 py-1 hover:text-blue-700"
                      >
                        + Add Option
                      </button>
                    </div>

                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <span className="text-sm text-gray-500 w-8">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 rounded-md border border-gray-700 bg-[#1a1a1a] text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition-all"
                          placeholder={`Option ${String.fromCharCode(
                            65 + optionIndex
                          )}`}
                          required
                        />

                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeOption(questionIndex, optionIndex)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Correct Answer *
                    </label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleCorrectAnswerChange(questionIndex, e.target.value)
                      }
                      className="w-full px-3 py-2 border text-white bg-[#212020] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select correct answer</option>
                      {question.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Creating..." : "Create Test"}
              </button>
            </div>
          </form>
        </div>

        {/* Created Tests */}
        <div className="bg-[#1e1e1e] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Created Tests
          </h2>

          {createdTests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No tests created yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdTests.map((test) => (
                <div
                  key={test._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-white mb-2">
                    {test.subject}
                  </h3>
                  <p className="text-sm text-white mb-1">
                    Chapter: {test.chapter}
                  </p>
                  <p className="text-sm text-white mb-1">
                    Topic: {test.topic}
                  </p>
                  <p className="text-sm text-white mb-2">
                    Questions: {test.questions.length}
                  </p>
                  <p className="text-xs text-white">
                    Created: {new Date(test.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSeriesCreate;