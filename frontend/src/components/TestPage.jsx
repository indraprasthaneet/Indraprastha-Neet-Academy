import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TestSeriesList from '../pages/TestSeriesList';
import TestCreator from '../pages/admin/TestCreator';


function TestPage() {
  const { userData } = useSelector((state) => state.user);
  const [testTitle, setTestTitle] = useState('');
  const [testQuestions, setTestQuestions] = useState([]);
  const [testStarted, setTestStarted] = useState(false);

  const handleTestCreation = (title, questions) => {
    setTestTitle(title);
    setTestQuestions(questions);
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">NEET Test Series</h1>

      {/* Educator View */}
      {userData?.role === "educator" && (
        <div className="mb-10">
          <TestCreator onSave={handleTestCreation} />
        </div>
      )}

      {/* Student View */}
      {userData?.role === "student" && testQuestions.length > 0 && !testStarted && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{testTitle}</h2>
          <button
            onClick={handleStartTest}
            className="bg-green-600 text-white px-6 py-2 rounded shadow"
          >
            Start Test
          </button>
        </div>
      )}

      {/* Test Interface */}
      {userData?.role === "student" && testStarted && (
        <TestSeriesList questions={testQuestions} title={testTitle} />
      )}

      {/* Fallback */}
      {!userData?.role && (
        <p className="text-center text-red-500 mt-10 font-medium">
          Please log in as a student to access the test.
        </p>
      )}
    </div>
  );
}

export default TestPage;
