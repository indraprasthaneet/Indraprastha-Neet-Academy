import React, { useState, useEffect } from 'react';
import { FiSave, FiImage, FiX, FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';

const Notepad = ({ isOpen, onClose, classNumber, subject, chapter, type, onNoteSaved }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingNote, setExistingNote] = useState(null);

  // Load existing note when component opens
  useEffect(() => {
    if (isOpen && classNumber && subject && chapter) {
      loadExistingNote();
    }
  }, [isOpen, classNumber, subject, chapter]);

  const loadExistingNote = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/notes`, {
        params: {
          class: classNumber,
          subject,
          chapter,
          type: type || 'pyq'
        },
        withCredentials: true
      });

      if (response.data.success && response.data.notes.length > 0) {
        const note = response.data.notes[0]; // Get the first note
        setExistingNote(note);
        setContent(note.noteText);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please add some content before saving');
      return;
    }

    try {
      setSaving(true);
      
      const noteData = {
        class: classNumber,
        subject,
        chapter,
        noteText: content,
        type: type || 'pyq'
      };

      let response;
      if (existingNote) {
        // Update existing note
        response = await axios.put(
          `${serverUrl}/api/notes/${existingNote._id}`,
          noteData,
          { withCredentials: true }
        );
      } else {
        // Create new note
        response = await axios.post(
          `${serverUrl}/api/notes`,
          noteData,
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        toast.success('Notes saved successfully!');
        onNoteSaved && onNoteSaved();
        setExistingNote(response.data.note);
      } else {
        toast.error(response.data.message || 'Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(error.response?.data?.message || 'Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setExistingNote(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-6xl mx-4 border border-gray-700 z-10 h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <FiEdit3 className="w-6 h-6 text-[#FFD700]" />
            <div>
              <h3 className="text-xl font-bold text-white">Notepad</h3>
              <p className="text-sm text-gray-400">
                {classNumber && subject && chapter && `${classNumber} • ${subject} • ${chapter}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#ffed4e] transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
                <p className="text-gray-300">Loading notepad...</p>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-lg p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full resize-none border-none outline-none text-gray-800"
                placeholder="Start writing your notes here..."
                style={{ minHeight: '500px' }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-[#2a2a2a] rounded-b-xl">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>Simple text editor</span>
              <span>•</span>
              <span>Auto-save functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Click Save to store your notes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notepad;
