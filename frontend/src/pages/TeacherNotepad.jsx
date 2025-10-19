import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiImage, FiArrowLeft, FiEdit3, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';

const TeacherNotepad = () => {
  const { bundleId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingNote, setExistingNote] = useState(null);
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);


  // Parse bundleId to extract class, subject, and chapter
  const parseBundleId = useCallback((bundleId) => {
    // Expected format: class11-physics-motion-in-a-straight-line
    const parts = bundleId.split('-');
    if (parts.length < 4) return null;
    
    const classNumber = parts[0].replace('class', '');
    const subject = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    const chapter = parts.slice(2).join(' ').replace(/-/g, ' ');
    const formattedChapter = chapter.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return { classNumber, subject, formattedChapter };
  }, []);

  const bundleInfo = useMemo(() => parseBundleId(bundleId), [bundleId, parseBundleId]);

  // Load existing note when component mounts
  useEffect(() => {
    const loadNote = async () => {
      if (loading || !bundleInfo) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/api/notes`, {
          params: {
            class: bundleInfo.classNumber,
            subject: bundleInfo.subject,
            chapter: bundleInfo.formattedChapter,
            type: 'pyq'
          },
          withCredentials: true
        });

        if (response.data.success && response.data.notes.length > 0) {
          const note = response.data.notes[0];
          setExistingNote(note);
          setContent(note.noteText || '');
          setTitle(note.title || '');
          setImages(note.images || []);
        } else {
          setExistingNote(null);
        }
      } catch (error) {
        console.error('Error loading note:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bundleInfo) {
      loadNote();
    }
  }, [bundleInfo]);

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

    if (!bundleInfo) {
      toast.error('Invalid bundle information');
      return;
    }

    setPdfUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('class', bundleInfo.classNumber);
    formData.append('subject', bundleInfo.subject);
    formData.append('chapter', bundleInfo.formattedChapter);
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
        setContent(response.data.text);
        setTitle(response.data.note.title || `${bundleInfo.subject} - ${bundleInfo.formattedChapter} Notes`);
        setExistingNote(response.data.note);
        toast.success('PDF text extracted and note created successfully!');
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size exceeds 5MB limit');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${serverUrl}/api/notes/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const newImages = [...images, response.data.imageUrl];
        setImages(newImages);
        console.log('Image uploaded successfully:', response.data.imageUrl);
        console.log('Updated images array:', newImages);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(response.data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please add some content before saving');
      return;
    }

    try {
      setSaving(true);
      console.log('Saving note...');
      
      const noteData = {
        class: bundleInfo.classNumber,
        subject: bundleInfo.subject,
        chapter: bundleInfo.formattedChapter,
        title: title.trim() || `${bundleInfo.subject} - ${bundleInfo.formattedChapter}`,
        noteText: content,
        images: images,
        type: 'pyq'
      };

      console.log('Saving note with data:', noteData);
      console.log('Images being saved:', images);

      let response;
      // Create new note
      response = await axios.post(
        `${serverUrl}/api/notes`,
        noteData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Notes saved successfully!');
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

  const handleBack = () => {
    navigate('/pyq-bundles');
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] ml-0 lg:ml-20 transition-all duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading notepad...</p>
        </div>
      </div>
    );
  }

  if (!bundleInfo) {
    return (
      <div className="min-h-screen bg-[#121212] ml-0 lg:ml-20 transition-all duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Bundle</h2>
            <p className="text-gray-400 mb-6">The requested bundle could not be found.</p>
            <button
              onClick={() => navigate('/pyq-bundles')}
              className="px-6 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#ffed4e] transition-colors"
            >
              Back to PYQ Bundles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] ml-0 lg:ml-20 transition-all duration-300">
      {/* Header */}
      <div className="bg-[#1e1e1e] border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to PYQ Bundles
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <FiEdit3 className="w-6 h-6 text-[#FFD700]" />
                <div>
                  <h1 className="text-xl font-bold text-white">Teacher Notepad</h1>
                  <p className="text-sm text-gray-400">
                    {bundleInfo && `${bundleInfo.classNumber} • ${bundleInfo.subject} • ${bundleInfo.formattedChapter}`}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#ffed4e] transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden">
          {/* Title Input */}
          <div className="p-6 border-b border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              placeholder="Enter a title for your notes..."
            />
          </div>

          {/* PDF Upload Section */}
          <div className="p-6 border-b border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload PDF (Optional)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                disabled={pdfUploading}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className={`px-4 py-2 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                  pdfUploading
                    ? 'border-gray-500 text-gray-500 cursor-not-allowed'
                    : 'border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black'
                }`}
              >
                {pdfUploading ? 'Uploading PDF...' : 'Choose PDF File'}
              </label>
              <span className="text-sm text-gray-400">
                Select a PDF file to automatically extract text and create notes (5MB max)
              </span>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Notes Content
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white cursor-pointer hover:bg-[#3a3a3a] transition-colors">
                  <FiImage className="w-4 h-4" />
                  {uploadingImage ? 'Uploading...' : 'Add Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            {/* Images Display */}
            {images.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Note image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiUpload className="w-3 h-3 rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text Editor */}
            <div className="bg-white rounded-lg overflow-hidden">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 p-4 border-none outline-none text-gray-800 resize-none"
                placeholder="Start writing your notes here... You can include text, images, and formatting."
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 bg-[#2a2a2a]">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <span>Rich text editor with image support</span>
                <span>•</span>
                <span>Auto-save functionality</span>
                <span>•</span>
                <span>{images.length} image(s) attached</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Click Save to store your notes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherNotepad;
