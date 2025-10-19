import express from "express";
import { 
  createTest, 
  getAllTests, 
  getEducatorTests,
  getTestById, 
  submitTest,
  getStudentTestResults,
  getTestResultDetails
} from "../controllers/testController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// POST /api/test-series/create - Create new test (educator only)
router.post("/create", isAuth, createTest);

// GET /api/test-series - Get all tests for students
router.get("/", isAuth, getAllTests);

// GET /api/test-series/educator - Get tests created by educator
router.get("/educator", isAuth, getEducatorTests);

// GET /api/test-series/results - Get student's test results
router.get("/results", isAuth, getStudentTestResults);

// GET /api/test-series/result/:attemptId - Get detailed test result
router.get("/result/:attemptId", isAuth, getTestResultDetails);

// GET /api/test-series/:id - Get specific test details
router.get("/:id", isAuth, getTestById);

// POST /api/test-series/:id/submit - Submit test answers
router.post("/:id/submit", isAuth, submitTest);

export default router;