import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBook, FiCalendar, FiUser, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';

const StudentNotesView = () => {
  const { bundleId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Log the bundleId
  console.log('StudentNotesView - bundleId from params:', bundleId);

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

  const bundleInfo = useMemo(() => {
    const parsed = parseBundleId(bundleId);
    console.log('StudentNotesView - parsed bundleInfo:', parsed);
    return parsed;
  }, [bundleId, parseBundleId]);

  // Load notes when component mounts
  useEffect(() => {
    const loadNotes = async () => {
      if (!bundleInfo) {
        setError('Invalid bundle ID format');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Loading notes for:', bundleInfo);
        
        const response = await axios.get(`${serverUrl}/api/notes`, {
          params: {
            class: bundleInfo.classNumber,
            subject: bundleInfo.subject,
            chapter: bundleInfo.formattedChapter,
            type: 'pyq'
          },
          withCredentials: true
        });

        console.log('Notes API response:', response.data);

        if (response.data.success) {
          setNotes(response.data.notes);
          console.log('Notes with images:', response.data.notes.map(note => ({ 
            id: note._id, 
            title: note.title, 
            images: note.images,
            imagesLength: note.images?.length 
          })));
          if (response.data.notes.length === 0) {
            setError('No notes available for this topic yet.');
          }
        } else {
          setError(response.data.message || 'Failed to load notes');
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        setError(error.response?.data?.message || 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [bundleInfo]);

 

  const handleBack = () => {
    navigate('/pyq-bundles');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] ml-0 lg:ml-20 transition-all duration-300 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-gray-300">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (!bundleInfo) {
    return (
      <div className="min-h-screen bg-[#121212] ml-0 lg:ml-20 transition-all duration-300 flex items-center justify-center px-4">
        <div className="text-center w-full max-w-xl">
          <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Invalid Bundle</h2>
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] ml-0 lg:ml-20 transition-all duration-300">
        {/* Header */}
        <div className="bg-[#1e1e1e] border-b border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors ml-10 mt-2"

              >
                <FiArrowLeft className="w-5 h-5 flex-shrink-0" />
                Back to PYQ Bundles
              </button>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 p-6 md:p-8">
              <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4 flex-shrink-0" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">No Notes Available</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#ffed4e] transition-colors"
              >
                Back to PYQ Bundles
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] ml-0 lg:ml-20 transition-all duration-300">
      {/* Header */}
      <div className="bg-[#1e1e1e] border-b border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 pl-14 md:pl-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Back to PYQ Bundles"
              >
                <FiArrowLeft className="w-5 h-5 flex-shrink-0" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-600 hidden sm:block"></div>
              <div className="flex items-center gap-3 min-w-0">
                <FiBook className="w-6 h-6 text-[#FFD700] flex-shrink-0" />
                <div className="truncate min-w-0">
                  <h1 className="text-lg md:text-xl font-bold text-white truncate">Study Notes</h1>
                  <p className="text-xs md:text-sm text-gray-400 truncate">
                    {bundleInfo && `${bundleInfo.classNumber} • ${bundleInfo.subject} • ${bundleInfo.formattedChapter}`}
                  </p>
                </div>
              </div>
                </div>
                <div className="text-sm text-gray-400 hidden sm:block">
              {notes.length} note{notes.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 p-8">
              <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4 flex-shrink-0" />
              <h2 className="text-2xl font-bold text-white mb-2">No Notes Available</h2>
              <p className="text-gray-400 mb-6">No notes have been created for this topic yet.</p>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#ffed4e] transition-colors"
              >
                Back to PYQ Bundles
              </button>
            </div>
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={note._id} className="mb-8">
              <div className="bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden">
                {/* Note Header */}
                <div className="p-4 md:p-6 border-b border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 truncate">
                        {note.title || `${bundleInfo.subject} - ${bundleInfo.formattedChapter}`}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span className="truncate">By {note.educatorId?.name || 'Teacher'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                          <span>Created {formatDate(note.createdAt)}</span>
                        </div>
                        {note.updatedAt !== note.createdAt && (
                          <div className="flex items-center gap-2">
                            <span>Updated {formatDate(note.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note Content */}
                <div className="p-4 md:p-6">
                  {/* Images */}
                  {note.images && note.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FiImage className="w-5 h-5 text-[#FFD700] flex-shrink-0" aria-hidden="true" />
                        <span className="text-sm font-medium text-gray-300">Attached Images ({note.images.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {note.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-600">
                            <div className="aspect-[16/10] w-full overflow-hidden">
                              <img
                                src={image}
                                alt={`Note image ${imgIndex + 1}`}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform cursor-pointer"
                                onClick={() => window.open(image, '_blank')}
                                onError={(e) => {
                                  console.error('Image failed to load:', image);
                                  e.target.style.display = 'none';
                                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            </div>
                            <div 
                              className="hidden w-full h-full bg-gray-700 rounded-lg border border-gray-600 items-center justify-center text-gray-400"
                              style={{display: 'none'}}
                            >
                              <div className="text-center p-4">
                                <FiImage className="w-8 h-8 mx-auto mb-2 flex-shrink-0" />
                                <p className="text-sm">Image failed to load</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-white rounded-lg p-4 md:p-6 text-gray-800 max-h-[60vh] md:max-h-[48vh] overflow-auto">
                      <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        {note.noteText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note Footer */}
                <div className="p-4 md:p-6 border-t border-gray-700 bg-[#2a2a2a]">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-sm text-gray-400 gap-3">
                    <div className="flex items-center gap-3 text-xs md:text-sm flex-wrap">
                      <span className="font-medium text-gray-300">Study Notes</span>
                      <span className="opacity-60">•</span>
                      <span>{note.images?.length || 0} image(s)</span>
                      <span className="opacity-60">•</span>
                      <span>{note.noteText.length} characters</span>
                    </div>
                    <div className="text-xs md:text-sm">
                      <span>Last updated {formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotesView;
