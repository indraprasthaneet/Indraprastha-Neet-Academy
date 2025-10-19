import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

const NotesViewer = ({ classNumber, subject, chapter, type, isOpen, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && classNumber && subject && chapter) {
      fetchNotes();
    }
  }, [isOpen, classNumber, subject, chapter]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const typeParam = type ? `&type=${type}` : '';
      const response = await axios.get(
        `${serverUrl}/api/notes?class=${classNumber}&subject=${subject}&chapter=${chapter}${typeParam}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-700 z-10 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Notes for {subject} - {chapter}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <ClipLoader size={32} color="#FFD700" />
            </div>
          ) : notes.length > 0 ? (
            <div className="space-y-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-400">
                      Added by {note.educatorId?.name || 'Educator'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-white whitespace-pre-wrap">
                    {note.noteText}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No notes available for this chapter</div>
              <div className="text-sm text-gray-500">
                Check back later or ask your educator to add notes
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#ffed4e] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesViewer;