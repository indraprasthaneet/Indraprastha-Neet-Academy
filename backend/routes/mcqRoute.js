import express from "express";
import { 
  createMcq, 
  getEducatorMcqs,
  getTodayMcq, 
  submitMcqAnswer,
  getStudentMcqResults,
  addVideoLink,
  removeVideoLink,
  canSubmitMcq,
  uploadMcqImage,
  removeMcqImage
} from "../controllers/mcqController.js";
import isAuth from "../middlewares/isAuth.js";
import mcqUpload from "../middlewares/mcqMulter.js";

const router = express.Router();

// POST /api/mcq/create - Create new MCQ with image (educator only)
router.post("/create", isAuth, mcqUpload.single('image'), createMcq);

// GET /api/mcq/can-submit - Check if educator can submit MCQ (educator only)
router.get("/can-submit", isAuth, canSubmitMcq);

// GET /api/mcq/educator - Get MCQs created by educator
router.get("/educator", isAuth, getEducatorMcqs);

// GET /api/mcq/today - Get today's MCQ (student only)
router.get("/today", isAuth, getTodayMcq);

// POST /api/mcq/submit - Submit MCQ answer (student only)
router.post("/submit", isAuth, submitMcqAnswer);

// GET /api/mcq/student-results - Get student's MCQ results
router.get("/student-results", isAuth, getStudentMcqResults);

// POST /api/mcq/add-video-link - Add YouTube video link to MCQ (educator only)
router.post("/add-video-link", isAuth, addVideoLink);

// DELETE /api/mcq/remove-video-link/:mcqId - Remove YouTube video link from MCQ (educator only)
router.delete("/remove-video-link/:mcqId", isAuth, removeVideoLink);

// POST /api/mcq/upload-image/:mcqId - Upload image for existing MCQ (educator only)
router.post("/upload-image/:mcqId", isAuth, mcqUpload.single('image'), uploadMcqImage);

// DELETE /api/mcq/remove-image/:mcqId - Remove image from MCQ (educator only)
router.delete("/remove-image/:mcqId", isAuth, removeMcqImage);

export default router;