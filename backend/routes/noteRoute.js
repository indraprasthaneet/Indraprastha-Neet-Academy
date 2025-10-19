import express from "express";
import { addNote, getNotes, getSubjectsByClass, getChaptersBySubject, extractPdfText, extractAndCreateNote, uploadNoteImage, updateNote, imageUpload } from "../controllers/noteController.js";
import isAuth from "../middlewares/isAuth.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import multer from "multer";

// Configure multer for PDF upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const noteRouter = express.Router();

// Add a new note (educator only)
noteRouter.post("/", isAuth, authorizeRoles("educator"), addNote);

// Update existing note (educator only)
noteRouter.put("/:id", isAuth, authorizeRoles("educator"), updateNote);

// Upload image for notes (educator only)
noteRouter.post("/upload-image", isAuth, authorizeRoles("educator"), imageUpload.single('image'), uploadNoteImage);

// Extract text from PDF (educator only)
noteRouter.post("/extract-pdf", isAuth, authorizeRoles("educator"), upload.single('pdf'), extractPdfText);

// Extract text from PDF and automatically create note (educator only)
noteRouter.post("/extract-and-create", isAuth, authorizeRoles("educator"), upload.single('pdf'), extractAndCreateNote);

// Get notes by class, subject, and chapter (public access)
noteRouter.get("/", getNotes);

// Get subjects by class (public access)
noteRouter.get("/subjects", getSubjectsByClass);

// Get chapters by subject and class (public access)
noteRouter.get("/chapters", getChaptersBySubject);

export default noteRouter;