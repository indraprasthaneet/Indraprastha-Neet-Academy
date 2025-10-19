import express from "express";
import { 
  addQuestion, 
  getQuestions, 
  getQuestionById, 
  submitAnswer,
  getStudentAttempts
} from "../controllers/questionController.js";
import isAuth from "../middlewares/isAuth.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const questionRouter = express.Router();

// Add a new question (educator only)
questionRouter.post("/", isAuth, authorizeRoles("educator"), addQuestion);

// Get questions by class, subject, and chapter
questionRouter.get("/", getQuestions);

// Get a specific question by ID
questionRouter.get("/:questionId", isAuth, getQuestionById);

// Submit answer for a question (student only)
questionRouter.post("/submit", isAuth, authorizeRoles("student"), submitAnswer);

// Get student's question attempts (student only)
questionRouter.get("/attempts/student", isAuth, authorizeRoles("student"), getStudentAttempts);

export default questionRouter;