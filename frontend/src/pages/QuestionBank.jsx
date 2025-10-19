import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBook, FaChevronRight, FaPlus, FaList } from 'react-icons/fa';
import AddQuestionModal from '../components/AddQuestionModal';

// Define chapter structure similar to PYQ bundle
const questionBankChapters = {
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

function QuestionBank() {
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedClass = queryParams.get("class");
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Question Bank
            </h1>
            <p className="text-xl text-gray-300">
              Select your class to access comprehensive question bank
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Class 11 Card */}
            <div
              className="bg-[#1e1e1e] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-700"
              onClick={() => navigate('/question-bank?class=11')}
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Class 11 Question Bank</h2>
                    <p className="text-gray-300">Topic-wise questions with detailed solutions</p>
                  </div>
                  <FaBook className="text-4xl text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-2">Subjects Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(questionBankChapters.class11).map((subject) => (
                        <span key={subject} className="px-3 py-1 bg-[#333] text-gray-300 rounded-full text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FaChevronRight className="text-2xl text-gray-500 group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Class 12 Card */}
            <div
              className="bg-[#1e1e1e] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-700"
              onClick={() => navigate('/question-bank?class=12')}
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Class 12 Question Bank</h2>
                    <p className="text-gray-300">Chapter-wise questions with expert explanations</p>
                  </div>
                  <FaBook className="text-4xl text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-2">Subjects Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(questionBankChapters.class12).map((subject) => (
                        <span key={subject} className="px-3 py-1 bg-[#333] text-gray-300 rounded-full text-sm">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FaChevronRight className="text-2xl text-gray-500 group-hover:text-[#FFD700] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-400">
            <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-3">What's Included?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span>Chapter-wise organized questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span>Subjective and Objective questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span>Practice and track progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subjects = Object.keys(questionBankChapters[`class${selectedClass}`]);
  const chapters = questionBankChapters[`class${selectedClass}`][selectedSubject];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Question Bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <button 
              onClick={() => navigate('/question-bank')}
              className="hover:text-[#FFD700] transition-colors"
            >
              Question Bank
            </button>
            <span>/</span>
            <span className="text-gray-300">Class {selectedClass}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Class {selectedClass} – {selectedSubject} Question Bank
          </h1>
          <p className="text-gray-400 text-center">
            {chapters.length} chapters available for {selectedSubject}
          </p>
        </div>

        {/* Subject Toggle */}
        <div className="bg-[#1e1e1e] rounded-xl shadow-sm p-6 mb-8 border border-gray-700">
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
        <div className="bg-[#1e1e1e] rounded-xl shadow-sm overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2a2a2a] border-b border-gray-600">
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">SUBJECT</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">CHAPTER</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">QUESTIONS</th>
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
                        <button
                          onClick={() => navigate(`/question-bank/${selectedClass}/${encodeURIComponent(selectedSubject)}/${encodeURIComponent(chapter)}`)}
                          className="text-[#4ade80] hover:text-[#4ade80]/80 transition-colors font-medium hover:underline flex items-center gap-1"
                        >
                          <FaList className="w-4 h-4" />
                          View Questions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            Total {chapters.length} chapters available for Class {selectedClass} {selectedSubject}
          </p>
        </div>
      </div>

      {/* Floating Action Button for Educators */}
      {userData && userData.role === "educator" && (
        <button
          onClick={() => setIsAddQuestionModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#FFD700] text-black rounded-full shadow-lg hover:bg-[#ffed4e] transition-all duration-300 flex items-center justify-center z-40"
        >
          <FaPlus className="w-6 h-6" />
        </button>
      )}

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        classNumber={selectedClass}
        questionBankChapters={questionBankChapters}
      />
    </div>
  );
}

export default QuestionBank;