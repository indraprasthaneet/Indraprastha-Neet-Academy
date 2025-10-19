import Question from "../models/questionModel.js";
import StudentQuestionAttempt from "../models/studentQuestionAttemptModel.js";
import User from "../models/userModel.js";

// Add a new question (Educator only)
export const addQuestion = async (req, res) => {
  try {
    const { class: classNumber, subject, chapter, questionText, questionType, options, correctAnswer, answerText } = req.body;
    const educatorId = req.user._id;

    // Validate user is educator
    const user = await User.findById(educatorId);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can add questions"
      });
    }

    // Validate required fields
    if (!classNumber || !subject || !chapter || !questionText || !questionType) {
      return res.status(400).json({
        success: false,
        message: "Class, subject, chapter, question text, and question type are required"
      });
    }

    // Validate question type specific fields
    if (questionType === 'objective') {
      if (!options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Objective questions must have at least 2 options"
        });
      }

      if (!correctAnswer) {
        return res.status(400).json({
          success: false,
          message: "Objective questions must have a correct answer"
        });
      }

      if (!options.includes(correctAnswer)) {
        return res.status(400).json({
          success: false,
          message: "Correct answer must be one of the provided options"
        });
      }
    } else if (questionType === 'subjective') {
      if (!answerText) {
        return res.status(400).json({
          success: false,
          message: "Subjective questions must have an answer text"
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Question type must be either 'objective' or 'subjective'"
      });
    }

    // Create new question
    const newQuestion = new Question({
      class: classNumber,
      subject,
      chapter,
      questionText,
      questionType,
      options: questionType === 'objective' ? options : undefined,
      correctAnswer: questionType === 'objective' ? correctAnswer : undefined,
      answerText: questionType === 'subjective' ? answerText : undefined,
      educatorId
    });

    await newQuestion.save();

    return res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: newQuestion
    });
  } catch (error) {
    console.error("Error adding question:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add question: " + error.message
    });
  }
};

// Get questions by class, subject, and chapter
export const getQuestions = async (req, res) => {
  try {
    const { class: classNumber, subject, chapter, questionType } = req.query;

    // Validate required query parameters
    if (!classNumber || !subject || !chapter) {
      return res.status(400).json({
        success: false,
        message: "Class, subject, and chapter are required query parameters"
      });
    }

    // Find questions matching the criteria
    const query = {
      class: classNumber,
      subject,
      chapter
    };

    // Add question type filter if specified
    if (questionType) {
      query.questionType = questionType;
    }

    const questions = await Question.find(query).populate("educatorId", "name");

    return res.status(200).json({
      success: true,
      questions
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions: " + error.message
    });
  }
};

// Get a specific question by ID (for students to attempt)
export const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Find question by ID
    const question = await Question.findById(questionId).populate("educatorId", "name");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    // For students, don't send the correct answer or answer text
    const user = await User.findById(req.user._id);
    if (user && user.role === 'student') {
      const questionForStudent = {
        ...question.toObject(),
        correctAnswer: undefined,
        answerText: undefined
      };
      return res.status(200).json({
        success: true,
        question: questionForStudent
      });
    }

    // For educators, send the full question
    return res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch question: " + error.message
    });
  }
};

// Submit answer for a question (Student only)
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, selectedOption, studentAnswer, timeSpent } = req.body;
    const studentId = req.user._id;

    // Validate user is student
    const user = await User.findById(studentId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "Only students can submit answers"
      });
    }

    // Validate required fields
    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required"
      });
    }

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    let isCorrect = false;
    let score = 0;

    // Check answer based on question type
    if (question.questionType === 'objective') {
      if (!selectedOption) {
        return res.status(400).json({
          success: false,
          message: "Selected option is required for objective questions"
        });
      }

      isCorrect = selectedOption === question.correctAnswer;
      score = isCorrect ? 100 : 0;
    } else if (question.questionType === 'subjective') {
      if (!studentAnswer) {
        return res.status(400).json({
          success: false,
          message: "Student answer is required for subjective questions"
        });
      }

      // For subjective questions, we'll give a default score of 50
      // In a real implementation, this would be manually graded by the educator
      isCorrect = true; // Assume correct for now
      score = 50; // Default score for subjective questions
    }

    // Save student attempt
    const newAttempt = new StudentQuestionAttempt({
      studentId,
      questionId,
      selectedOption: question.questionType === 'objective' ? selectedOption : undefined,
      studentAnswer: question.questionType === 'subjective' ? studentAnswer : undefined,
      isCorrect,
      timeSpent: timeSpent || 0,
      score
    });

    await newAttempt.save();

    return res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      attempt: newAttempt,
      correctAnswer: question.questionType === 'objective' ? question.correctAnswer : undefined
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit answer: " + error.message
    });
  }
};

// Get student's question attempts
export const getStudentAttempts = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Validate user is student
    const user = await User.findById(studentId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "Only students can access this endpoint"
      });
    }

    const attempts = await StudentQuestionAttempt.find({ studentId })
      .populate({
        path: 'questionId',
        select: 'questionText questionType subject chapter class',
      })
      .sort({ createdAt: -1 });

    // Calculate summary statistics
    const totalAttempts = attempts.length;
    const correctAnswers = attempts.filter(attempt => attempt.isCorrect).length;
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;

    return res.status(200).json({
      success: true,
      attempts,
      summary: {
        totalAttempts,
        correctAnswers,
        totalScore,
        averageScore
      }
    });
  } catch (error) {
    console.error("Error fetching student attempts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attempts: " + error.message
    });
  }
};