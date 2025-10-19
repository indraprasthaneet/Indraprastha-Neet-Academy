import Note from "../models/noteModel.js";
import pdf from "pdf-parse";

// Add a new note
export const addNote = async (req, res) => {
  try {
    const { class: classNumber, subject, chapter, noteText, type } = req.body;
    const educator = req.user._id;

    // Validate required fields
    if (!classNumber || !subject || !chapter || !noteText) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Create new note
    const newNote = new Note({
      class: classNumber,
      subject,
      chapter,
      noteText,
      educatorId: educator,
      type: type || "pyq" // Default to "pyq" if not specified
    });

    await newNote.save();

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      note: newNote
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add note: " + error.message
    });
  }
};

// Get notes by class, subject, and chapter
export const getNotes = async (req, res) => {
  try {
    const { class: classNumber, subject, chapter, type } = req.query;

    // Validate required query parameters
    if (!classNumber || !subject || !chapter) {
      return res.status(400).json({
        success: false,
        message: "Class, subject, and chapter are required query parameters"
      });
    }

    // Find notes matching the criteria
    const query = {
      class: classNumber,
      subject,
      chapter
    };

    // Add type filter if specified
    if (type) {
      query.type = type;
    }

    const notes = await Note.find(query).populate("educatorId", "name");

    return res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes: " + error.message
    });
  }
};

// Get subjects by class
export const getSubjectsByClass = async (req, res) => {
  try {
    const { class: classNumber } = req.query;

    if (!classNumber) {
      return res.status(400).json({
        success: false,
        message: "Class is required"
      });
    }

    // Since there's no PYQBundle model, we'll return an empty array
    // In a real implementation, this would fetch subjects from a proper data source
    const subjects = [];

    return res.status(200).json({
      success: true,
      subjects
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects: " + error.message
    });
  }
};

// Get chapters by subject and class
export const getChaptersBySubject = async (req, res) => {
  try {
    const { class: classNumber, subject } = req.query;

    if (!classNumber || !subject) {
      return res.status(400).json({
        success: false,
        message: "Class and subject are required"
      });
    }

    // Since there's no PYQBundle model, we'll return an empty array
    // In a real implementation, this would fetch chapters from a proper data source
    const chapters = [];

    return res.status(200).json({
      success: true,
      chapters
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chapters: " + error.message
    });
  }
};

// Extract text from PDF with better formatting
export const extractPdfText = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded"
      });
    }

    // Extract text from PDF with item layout to preserve structure
    const data = await pdf(req.file.buffer, {
      itemLayout: true // This helps preserve the layout structure
    });
    
    // Clean the extracted text with better formatting
    let extractedText = data.text;
    
    // Remove excessive whitespace while preserving meaningful line breaks
    extractedText = extractedText.replace(/
\s*
\s*/g, '

');
    extractedText = extractedText.replace(/\r/g, '\n');   // Normalize line endings
    
    // Preserve paragraph breaks (double newlines)
    extractedText = extractedText.replace(/
\s*
\s*/g, '

');
    
    // Remove leading/trailing whitespace from each line
    extractedText = extractedText.split('\n').map(line => line.trimEnd()).join('\n');
    
    // Trim overall text
    extractedText = extractedText.trim();
    
    return res.status(200).json({
      success: true,
      text: extractedText,
      message: "Text extracted successfully"
    });
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to extract text from PDF: " + error.message
    });
  }
};