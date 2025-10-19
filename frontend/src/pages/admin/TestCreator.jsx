import React, { useState } from 'react';

function TestCreator({ onSave }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
  });

  const handleChange = (index, value) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;
    setForm({ ...form, options: updatedOptions });
  };

  const addQuestion = () => {
    if (!form.question.trim() || form.options.some(opt => !opt.trim())) return;
    setQuestions([...questions, form]);
    setForm({ question: '', options: ['', '', '', ''], correctIndex: 0 });
  };

  const handleSubmit = () => {
    if (!title.trim() || questions.length === 0) return;
    onSave(title, questions);
    setTitle('');
    setQuestions([]);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Test</h2>
      <input
        type="text"
        placeholder="Test Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Enter question"
        value={form.question}
        onChange={(e) => setForm({ ...form, question: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
      />
      {form.options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={(e) => handleChange(idx, e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
      ))}
      <label className="block mb-2">
        Correct Option Index (0–3):
        <input
          type="number"
          min="0"
          max="3"
          value={form.correctIndex}
          onChange={(e) => setForm({ ...form, correctIndex: parseInt(e.target.value) })}
          className="ml-2 p-1 border rounded"
        />
      </label>
      <div className="flex gap-4 mt-4">
        <button onClick={addQuestion} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Question
        </button>
        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
          Save Test
        </button>
      </div>
    </div>
  );
}

export default TestCreator;
