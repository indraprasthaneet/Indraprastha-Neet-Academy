import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiDownload, FiBook, FiChevronRight, FiPlus, FiFileText, FiEdit3 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import AddNoteModal from '../components/AddNoteModal';

const pyqChapters = {
  class11: {
    Physics: [
      "Physical World", "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane",
      "Laws of Motion", "Work, Energy and Power", "System of Particles and Rotational Motion",
      "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids",
      "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"
    ],
    Chemistry: [
      "Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity",
      "Chemical Bonding and Molecular Structure", "States of Matter", "Thermodynamics", "Equilibrium",
      "Redox Reactions", "Hydrogen", "The s-Block Element", "Some p-Block Elements",
      "Organic Chemistry - Basic Principles", "Hydrocarbons", "Environmental Chemistry"
    ],
    Biology: [
      "Diversity of Living Organisms", "Biological Classification", "Plant Kingdom", "Animal Kingdom",
      "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals",
      "Cell - The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Transport in Plants",
      "Mineral Nutrition", "Photosynthesis in Higher Plants", "Respiration in Plants",
      "Plant Growth and Development", "Digestion and Absorption", "Breathing and Exchange of Gases",
      "Body Fluids and Circulation", "Excretory Products and Elimination", "Locomotion and Movement",
      "Neural Control and Coordination", "Chemical Coordination and Integration"
    ]
  },
  class12: {
    Physics: [
      "Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity",
      "Magnetic Effects of Current", "Magnetism", "Electromagnetic Induction", "Alternating Current",
      "Electromagnetic Waves", "Ray Optics", "Wave Optics", "Dual Nature of Radiation and Matter",
      "Atoms", "Nuclei", "Semiconductor Electronics"
    ],
    Chemistry: [
      "Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry",
      "The p-Block Element", "The d- and f-Block Elements", "Coordination Compounds",
      "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids",
      "Organic Compounds Containing Nitrogen", "Biomolecules", "Polymers", "Chemistry in Everyday Life"
    ],
    Biology: [
      "Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction",
      "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance",
      "Evolution", "Human Health and Disease", "Strategies for Enhancement in Food Production",
      "Microbes in Human Welfare", "Biotechnology - Principles and Processes",
      "Biotechnology and Its Applications", "Organisms and Populations", "Ecosystem",
      "Biodiversity and Conservation", "Environmental Issues"
    ]
  }
};

function PYQBundle() {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedClass = queryParams.get("class");
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedClass]);

  // If no class is selected, show class selection page
  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-[#121212] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Previous Year Question Bundles
            </h1>
            <p className="text-xl text-gray-300">
              Select your class to access comprehensive PYQ bundles
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Class 11 Card */}
            <div
              className="bg-[#1e1e1e] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-700"
              onClick={() => navigate('/pyq-bundles?class=11')}
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Class 11 PYQ Bundle</h2>
                    <p className="text-gray-300">Topic-wise NEET questions with detailed solutions</p>
                  </div>
                  <FiBook className="text-4xl text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-2">Subjects Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(pyqChapters.class11).map((subject) => (
                        <span key={subject} className="px-3 py-1 bg-[#333] text-gray-300 rounded-full text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FiChevronRight className="text-2xl text-gray-500 group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Class 12 Card */}
            <div
              className="bg-[#1e1e1e] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-700"
              onClick={() => navigate('/pyq-bundles?class=12')}
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Class 12 PYQ Bundle</h2>
                    <p className="text-gray-300">Chapter-wise NEET questions with expert explanations</p>
                  </div>
                  <FiBook className="text-4xl text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-2">Subjects Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(pyqChapters.class12).map((subject) => (
                        <span key={subject} className="px-3 py-1 bg-[#333] text-gray-300 rounded-full text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FiChevronRight className="text-2xl text-gray-500 group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-12 text-center"
          >
            <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">What's Included?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span>Chapter-wise organized questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span>Detailed solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span>PDF downloads available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subjects = Object.keys(pyqChapters[`class${selectedClass}`]);
  const chapters = pyqChapters[`class${selectedClass}`][selectedSubject];

  const handleViewNotes = (chapter) => {
    // Create bundleId from class, subject, and chapter
    const bundleId = `class${selectedClass}-${selectedSubject.toLowerCase()}-${chapter.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(`/view-notes/${bundleId}`);
  };

  const handleOpenNotepad = (chapter) => {
    // Create bundleId from class, subject, and chapter
    const bundleId = `class${selectedClass}-${selectedSubject.toLowerCase()}-${chapter.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(`/notepad/${bundleId}`);
  };

  const handleNoteAdded = () => {
    // Refresh notes if needed
    // This can be used for future enhancements
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading PYQ bundles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 ml-15 md:ml-0">
            <button 
              onClick={() => navigate('/pyq-bundles')}
              className="hover:text-[#FFD700] transition-colors"
            >
              PYQ Bundles
            </button>
            <span>/</span>
            <span className="text-gray-300">Class {selectedClass}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Class {selectedClass} – {selectedSubject} PYQ Bundle
          </h1>
          <p className="text-gray-400 text-center">
            {chapters.length} chapters available for {selectedSubject}
          </p>
        </div>

        {/* Subject Toggle */}
        <div
          className="bg-[#1e1e1e] rounded-xl shadow-sm p-6 mb-8 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Select Subject:</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:brightness-110 ${
                  selectedSubject === subject
                    ? "bg-[#FFD700] text-black shadow-lg"
                    : "bg-[#333] text-white hover:bg-[#444]"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Table */}
        <div
          className="bg-[#1e1e1e] rounded-xl shadow-sm overflow-hidden border border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-gray-600">
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">SUBJECT</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">CHAPTER</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">NOTES</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter, index) => (
                  <tr
                    key={chapter}
                    className={`border-b border-gray-700 hover:bg-[#2a2a2a] transition-colors ${
                      index % 2 === 0 ? 'bg-[#1e1e1e]' : 'bg-[#252525]'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-white font-medium">{selectedSubject}</td>
                    <td className="px-6 py-4 text-sm text-white">{chapter}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {userData && userData.role === "educator" ? (
                          <button
                            onClick={() => handleOpenNotepad(chapter)}
                            className="text-[#FFD700] hover:text-[#ffed4e] transition-colors font-medium hover:underline flex items-center gap-1"
                          >
                            <FiEdit3 className="w-4 h-4" />
                            Go to Notepad
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewNotes(chapter)}
                            className="text-[#4ade80] hover:text-[#4ade80]/80 transition-colors font-medium hover:underline flex items-center gap-1"
                          >
                            <FiFileText className="w-4 h-4" />
                            View Notes
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div
          className="mt-8 text-center text-gray-400"
        >
          <p className="text-sm">
            Total {chapters.length} chapters available for Class {selectedClass} {selectedSubject}
          </p>
        </div>
      </div>

      {/* Floating Action Button for Educators */}
      {userData && userData.role === "educator" && (
        <button
          onClick={() => setIsAddNoteModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#FFD700] text-black rounded-full shadow-lg hover:bg-[#ffed4e] transition-all duration-300 flex items-center justify-center z-40"
        >
          <FiPlus className="w-6 h-6" />
        </button>
      )}

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        classNumber={selectedClass}
        pyqChapters={pyqChapters}
        type="pyq"
        onNoteAdded={handleNoteAdded}
      />
    </div>
  );
}

export default PYQBundle;