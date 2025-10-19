import React from 'react';
import QuestionBank from './QuestionBank';
import QuestionChapterPage from './QuestionChapterPage';
import Playground from './Playground';

function TestQuestionBank() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Question Bank Component Test</h1>
      <p className="mb-4">This page tests the Question Bank components</p>
      
      <div className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">QuestionBank Component</h2>
        <div className="max-w-4xl">
          <QuestionBank />
        </div>
      </div>
      
      <div className="border p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">QuestionChapterPage Component</h2>
        <div className="max-w-4xl">
          <QuestionChapterPage />
        </div>
      </div>
      
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Playground Component</h2>
        <div className="max-w-4xl">
          <Playground />
        </div>
      </div>
    </div>
  );
}

export default TestQuestionBank;