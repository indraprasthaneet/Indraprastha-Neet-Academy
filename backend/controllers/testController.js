import Test from "../models/testModel.js";
import TestAttempt from "../models/testAttemptModel.js";
import User from "../models/userModel.js";

// Create a new test (Educator only)
export const createTest = async (req, res) => {
  try {
    const { subject, chapter, topic, questions } = req.body;
    const createdBy = req.userId;

    // Validate user is educator
    const user = await User.findById(createdBy);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can create tests"
      });
    }

    // Validate questions format
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one question is required"
      });
    }

    // Validate each question
    for (let question of questions) {
      if (!question.text || !question.options || question.options.length < 2 || !question.correctAnswer) {
        return res.status(400).json({
          success: false,
          message: "Each question must have text, at least 2 options, and a correct answer"
        });
      }
    }

    const newTest = new Test({
      subject,
      chapter,
      topic,
      questions,
      createdBy
    });

    const savedTest = await newTest.save();
    
    res.status(201).json({
      success: true,
      message: "Test created successfully",
      test: savedTest
    });

  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all tests for students
export const getAllTests = async (req, res) => {
  try {
    const studentId = req.userId;
    console.log('Student requesting tests:', studentId);
    
    // Get all tests
    const tests = await Test.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    console.log('Found tests in database:', tests.length);
    console.log('Test details:', tests.map(t => ({ subject: t.subject, chapter: t.chapter, topic: t.topic })));

    // Get user's test attempts
    const attempts = await TestAttempt.find({ studentId });
    console.log('Found attempts for student:', attempts.length);
    
    // Create a map of test attempts by testId
    const attemptsMap = {};
    attempts.forEach(attempt => {
      attemptsMap[attempt.testId.toString()] = attempt;
    });

    // Add attempt info to each test
    const testsWithAttempts = tests.map(test => {
      const attempt = attemptsMap[test._id.toString()];
      return {
        ...test.toObject(),
        attempted: !!attempt,
        score: attempt ? attempt.score : null,
        submittedAt: attempt ? attempt.submittedAt : null
      };
    });
    
    console.log('Sending response with tests:', testsWithAttempts.length);
    res.status(200).json({
      success: true,
      tests: testsWithAttempts
    });

  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get tests created by educator
export const getEducatorTests = async (req, res) => {
  try {
    const educatorId = req.userId;

    // Validate user is educator
    const user = await User.findById(educatorId);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can access this endpoint"
      });
    }

    const tests = await Test.find({ createdBy: educatorId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tests
    });

  } catch (error) {
    console.error("Error fetching educator tests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get specific test details
export const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const test = await Test.findById(id)
      .populate('createdBy', 'name');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    // Check if student has already attempted this test
    const existingAttempt = await TestAttempt.findOne({
      studentId: userId,
      testId: id
    });

    res.status(200).json({
      success: true,
      test,
      attempted: !!existingAttempt,
      score: existingAttempt ? existingAttempt.score : null
    });

  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Submit test answers
export const submitTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent, timeAlloted, startedAt } = req.body;
    const studentId = req.userId;

    // Check if test exists
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    // Check if student has already attempted this test
    const existingAttempt = await TestAttempt.findOne({
      studentId,
      testId: id
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this test"
      });
    }

    // Calculate score and prepare detailed answers
    let score = 0;
    const totalQuestions = test.questions.length;
    
    const formattedAnswers = answers.map((answer, index) => {
      const question = test.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) {
        score++;
      }
      return {
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    const percentage = Math.round((score / totalQuestions) * 100);

    // Create test attempt with enhanced data
    const testAttempt = new TestAttempt({
      studentId,
      testId: id,
      answers: formattedAnswers,
      score,
      totalQuestions,
      percentage,
      timeSpent: timeSpent || 0,
      timeAlloted: timeAlloted || (totalQuestions * 120), // Default 2 minutes per question
      startedAt: startedAt ? new Date(startedAt) : new Date()
    });

    await testAttempt.save();

    res.status(201).json({
      success: true,
      message: "Test submitted successfully",
      result: {
        score,
        totalQuestions,
        percentage,
        timeSpent,
        correctAnswers: score,
        incorrectAnswers: totalQuestions - score
      }
    });

  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get student's test results/history
export const getStudentTestResults = async (req, res) => {
  try {
    const studentId = req.userId;

    // Get all test attempts for the student with populated test details
    const testAttempts = await TestAttempt.find({ studentId })
      .populate({
        path: 'testId',
        select: 'subject chapter topic questions createdBy createdAt',
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .sort({ submittedAt: -1 });

    // Format the results
    const formattedResults = testAttempts.map(attempt => ({
      _id: attempt._id,
      test: {
        _id: attempt.testId._id,
        subject: attempt.testId.subject,
        chapter: attempt.testId.chapter,
        topic: attempt.testId.topic,
        createdBy: attempt.testId.createdBy
      },
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      timeSpent: attempt.timeSpent,
      timeAlloted: attempt.timeAlloted,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      timeTaken: attempt.timeSpent, // For compatibility
      questionsAttempted: attempt.answers.length
    }));

    // Calculate summary statistics
    const totalAttempts = testAttempts.length;
    const averageScore = totalAttempts > 0 
      ? Math.round(testAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts)
      : 0;
    const totalTimeSpent = testAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);

    res.status(200).json({
      success: true,
      results: formattedResults,
      summary: {
        totalAttempts,
        averageScore,
        totalTimeSpent,
        bestScore: totalAttempts > 0 ? Math.max(...testAttempts.map(a => a.percentage)) : 0
      }
    });

  } catch (error) {
    console.error("Error fetching student test results:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get detailed test result by attempt ID
export const getTestResultDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.userId;

    // Get the specific test attempt with full details
    const testAttempt = await TestAttempt.findOne({ 
      _id: attemptId, 
      studentId 
    })
    .populate({
      path: 'testId',
      select: 'subject chapter topic questions createdBy createdAt',
      populate: {
        path: 'createdBy',
        select: 'name'
      }
    });

    if (!testAttempt) {
      return res.status(404).json({
        success: false,
        message: "Test attempt not found"
      });
    }

    // Format detailed result with question-wise analysis
    const questionAnalysis = testAttempt.answers.map((answer, index) => {
      const question = testAttempt.testId.questions.find(q => q._id.toString() === answer.questionId.toString());
      return {
        questionNumber: index + 1,
        questionText: question?.text || 'Question not found',
        options: question?.options || [],
        correctAnswer: question?.correctAnswer || '',
        selectedAnswer: answer.selectedAnswer,
        isCorrect: answer.isCorrect
      };
    });

    const detailedResult = {
      _id: testAttempt._id,
      test: {
        _id: testAttempt.testId._id,
        subject: testAttempt.testId.subject,
        chapter: testAttempt.testId.chapter,
        topic: testAttempt.testId.topic,
        createdBy: testAttempt.testId.createdBy
      },
      score: testAttempt.score,
      totalQuestions: testAttempt.totalQuestions,
      percentage: testAttempt.percentage,
      timeSpent: testAttempt.timeSpent,
      timeAlloted: testAttempt.timeAlloted,
      startedAt: testAttempt.startedAt,
      submittedAt: testAttempt.submittedAt,
      questionAnalysis
    };

    res.status(200).json({
      success: true,
      result: detailedResult
    });

  } catch (error) {
    console.error("Error fetching test result details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};