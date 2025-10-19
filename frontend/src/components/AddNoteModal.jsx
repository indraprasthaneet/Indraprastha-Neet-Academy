import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';

const AddNoteModal = ({ isOpen, onClose, classNumber, pyqChapters, type, onNoteAdded }) => {
  const [classValue, setClassValue] = useState(classNumber || '11');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setClassValue(classNumber || '11');
      setSubject('');
      setChapter('');
      setNoteText('');
      setSubjects([]);
      setChapters([]);
      
      // Get subjects for the selected class
      if (classNumber) {
        const classSubjects = Object.keys(pyqChapters[`class${classNumber}`] || {});
        setSubjects(classSubjects);
      }
    }
  }, [isOpen, classNumber, pyqChapters]);

  // Update subjects when class changes
  useEffect(() => {
    if (classValue) {
      const classSubjects = Object.keys(pyqChapters[`class${classValue}`] || {});
      setSubjects(classSubjects);
      setSubject('');
      setChapter('');
      setChapters([]);
    }
  }, [classValue, pyqChapters]);

  // Update chapters when subject changes
  useEffect(() => {
    if (subject && classValue) {
      const subjectChapters = pyqChapters[`class${classValue}`][subject] || [];
      setChapters(subjectChapters);
      setChapter('');
    }
  }, [subject, classValue, pyqChapters]);

  // Handle PDF upload and text extraction
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    // Validate that all required fields are filled
    if (!classValue || !subject || !chapter) {
      toast.error('Please select Class, Subject, and Chapter before uploading PDF');
      return;
    }

    setPdfUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('class', classValue);
    formData.append('subject', subject);
    formData.append('chapter', chapter);
    formData.append('type', 'pyq');

    try {
      const response = await axios.post(
        `${serverUrl}/api/notes/extract-and-create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setNoteText(response.data.text);
        toast.success('PDF text extracted and note created successfully!');
        // Call the callback to refresh notes if needed
        onNoteAdded && onNoteAdded();
      } else {
        toast.error(response.data.message || 'Failed to extract PDF text');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error(error.response?.data?.message || 'Failed to upload PDF');
    } finally {
      setPdfUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!classValue || !subject || !chapter || !noteText.trim()) {
        toast.error('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Submit note
      const response = await axios.post(
        `${serverUrl}/api/notes`,
        {
          class: classValue,
          subject,
          chapter,
          noteText: noteText.trim(),
          type: type || 'pyq'
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Notes added successfully');
        onNoteAdded && onNoteAdded();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add notes');
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.message || 'Failed to add notes');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Add Notes</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Class
              </label>
              <select
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                disabled={!!classNumber}
              >
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Chapter
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                required
              >
                <option value="">Select Chapter</option>
                {chapters.map((chap) => (
                  <option key={chap} value={chap}>
                    {chap}
                  </option>
                ))}
              </select>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Upload PDF (Optional)
              </label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white cursor-pointer hover:bg-[#3a3a3a] transition-colors text-center">
                  {pdfUploading ? (
                    <div className="flex items-center justify-center">
                      <ClipLoader size={16} color="#FFF" className="mr-2" />
                      <span>Extracting...</span>
                    </div>
                  ) : (
                    'Choose PDF File'
                  )}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                    disabled={pdfUploading}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select a PDF file to automatically extract text (5MB max)
              </p>
            </div>

            {/* Notes Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] resize-none"
                placeholder="Enter notes for students or extracted PDF text will appear here..."
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pdfUploading}
              className="px-4 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#ffed4e] transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <ClipLoader size={16} color="#000" className="mr-2" />
                  Adding...
                </>
              ) : (
                'Add Notes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;