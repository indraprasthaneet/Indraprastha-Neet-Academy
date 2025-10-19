import Note from "../models/noteModel.js";
import pdf from "pdf-parse";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'notes');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'note-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Add a new note
export const addNote = async (req, res) => {
  try {
    const { class: classNumber, subject, chapter, title, noteText, images, type } = req.body;
    const educator = req.user._id;

    console.log('Creating note with data:', { classNumber, subject, chapter, title, images, type });
    console.log('Images array:', images);

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
      title: title || "",
      noteText,
      images: images || [],
      educatorId: educator,
      type: type || "pyq" // Default to "pyq" if not specified
    });

    await newNote.save();

    console.log('Note saved successfully:', newNote._id);
    console.log('Saved note images:', newNote.images);

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
    
    console.log('getNotes API called with params:', { classNumber, subject, chapter, type });

    // Validate required query parameters
    if (!classNumber || !subject || !chapter) {
      console.log('Missing required parameters');
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

    console.log('Searching notes with query:', query);
    const notes = await Note.find(query).populate("educatorId", "name");
    console.log('Found notes:', notes.length);
    console.log('Notes with images:', notes.map(note => ({ 
      id: note._id, 
      title: note.title, 
      images: note.images,
      imagesLength: note.images?.length 
    })));

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
    extractedText = extractedText.replace(/\n\s*\n\s*/g, '\n\n');
    extractedText = extractedText.replace(/\r/g, '\n');   // Normalize line endings
    
    // Preserve paragraph breaks (double newlines)
    extractedText = extractedText.replace(/\n\s*\n\s*/g, '\n\n');
    
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

// Extract text from PDF and automatically create note
export const extractAndCreateNote = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded"
      });
    }

    const { class: classNumber, subject, chapter, type } = req.body;
    const educator = req.user._id;

    // Validate required fields
    if (!classNumber || !subject || !chapter) {
      return res.status(400).json({
        success: false,
        message: "Class, subject, and chapter are required"
      });
    }

    // Extract text from PDF with item layout to preserve structure
    const data = await pdf(req.file.buffer, {
      itemLayout: true // This helps preserve the layout structure
    });
    
    // Clean the extracted text with better formatting
    let extractedText = data.text;
    
    // Remove excessive whitespace while preserving meaningful line breaks
    extractedText = extractedText.replace(/\n\s*\n\s*/g, '\n\n');
    extractedText = extractedText.replace(/\r/g, '\n');   // Normalize line endings
    
    // Preserve paragraph breaks (double newlines)
    extractedText = extractedText.replace(/\n\s*\n\s*/g, '\n\n');
    
    // Remove leading/trailing whitespace from each line
    extractedText = extractedText.split('\n').map(line => line.trimEnd()).join('\n');
    
    // Trim overall text
    extractedText = extractedText.trim();

    // Check if a note already exists for this chapter
    const existingNote = await Note.findOne({
      class: classNumber,
      subject,
      chapter,
      educatorId: educator,
      type: type || 'pyq'
    });

    let note;
    if (existingNote) {
      // Update existing note
      note = await Note.findOneAndUpdate(
        { _id: existingNote._id },
        {
          noteText: extractedText,
          title: `${subject} - ${chapter} Notes`
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new note
      note = new Note({
        class: classNumber,
        subject,
        chapter,
        title: `${subject} - ${chapter} Notes`,
        noteText: extractedText,
        educatorId: educator,
        type: type || 'pyq'
      });
      await note.save();
    }
    
    return res.status(200).json({
      success: true,
      text: extractedText,
      note: note,
      message: "PDF text extracted and note created successfully"
    });
  } catch (error) {
    console.error("Error extracting PDF and creating note:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to extract text from PDF and create note: " + error.message
    });
  }
};

// Upload image for notes
export const uploadNoteImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }

    // Create full URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/notes/${req.file.filename}`;
    console.log('Image uploaded:', imageUrl);

    return res.status(200).json({
      success: true,
      imageUrl,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image: " + error.message
    });
  }
};

// Update existing note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { class: classNumber, subject, chapter, title, noteText, images, type } = req.body;
    const educator = req.user._id;

    // Validate required fields
    if (!classNumber || !subject || !chapter || !noteText) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Find and update note
    const note = await Note.findOneAndUpdate(
      { _id: id, educatorId: educator },
      {
        class: classNumber,
        subject,
        chapter,
        title: title || "",
        noteText,
        images: images || [],
        type: type || "pyq"
      },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you don't have permission to update it"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update note: " + error.message
    });
  }
};

// Export multer middleware for use in routes
export { imageUpload };