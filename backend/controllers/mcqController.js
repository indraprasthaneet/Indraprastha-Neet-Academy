import McqOfTheDay from "../models/mcqOfTheDayModel.js";
import StudentMcqResponse from "../models/studentMcqResponseModel.js";
import User from "../models/userModel.js";
import mcqUpload from "../middlewares/mcqMulter.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create MCQ (Educator only)
export const createMcq = async (req, res) => {
  try {
    const { subject, chapter, topic, question, options, correctAnswer, videoLink } = req.body;
    const createdBy = req.userId;

    // Parse options if it's a JSON string
    let parsedOptions = options;
    if (typeof options === 'string') {
      try {
        parsedOptions = JSON.parse(options);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid options format"
        });
      }
    }


    // Validate user is educator
    const user = await User.findById(createdBy);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can create MCQs"
      });
    }

    // Check if educator has submitted an MCQ within the last 24 hours
    if (user.lastMcqSubmission) {
      const now = new Date();
      const lastSubmission = new Date(user.lastMcqSubmission);
      const hoursSinceLastSubmission = (now - lastSubmission) / (1000 * 60 * 60);
      
      if (hoursSinceLastSubmission < 24) {
        const hoursLeft = Math.ceil(24 - hoursSinceLastSubmission);
        return res.status(400).json({
          success: false,
          message: `You can only submit one MCQ of the Day every 24 hours. Please try again later.`
        });
      }
    }

    // Validate input
    if (!subject || !chapter || !topic || !question || !parsedOptions || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!Array.isArray(parsedOptions) || parsedOptions.length < 4) {
      return res.status(400).json({
        success: false,
        message: "At least 4 options are required"
      });
    }

    // Check that all options are non-empty
    const nonEmptyOptions = parsedOptions.filter(option => option && option.trim() !== '');
    if (nonEmptyOptions.length < 4) {
      return res.status(400).json({
        success: false,
        message: "All 4 options must be filled"
      });
    }

    if (!parsedOptions.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be one of the provided options"
      });
    }

    // Validate YouTube URL if provided
    let validatedVideoLink = null;
    if (videoLink) {
      const isValidYouTubeUrl = (url) => {
        try {
          const urlObj = new URL(url);
          const host = urlObj.hostname;
          const pathname = urlObj.pathname;
          const searchParams = urlObj.searchParams;
          
          // Check if it's a YouTube domain (allow both http and https, with or without www)
          if (!host.includes('youtube.com') && !host.includes('youtu.be')) {
            return false;
          }
          
          // For youtu.be short URLs
          if (host.includes('youtu.be') && pathname.length > 1) {
            return true;
          }
          
          // For youtube.com URLs, check if it has a video parameter
          if (host.includes('youtube.com') && pathname === '/watch' && searchParams.has('v')) {
            return true;
          }
          
          return false;
        } catch {
          // If URL parsing fails, it's not a valid URL
          return false;
        }
      };
      
      if (!isValidYouTubeUrl(videoLink)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid YouTube URL"
        });
      }
      
      validatedVideoLink = videoLink;
    }

    // Handle image upload if present
    let imageUrl = null;
    if (req.file) {
      // Construct the image URL relative to the server
      const relativePath = `/uploads/mcq/${req.file.filename}`;
      imageUrl = relativePath;
    }

    const newMcq = new McqOfTheDay({
      subject,
      chapter,
      topic,
      question,
      options: parsedOptions,
      correctAnswer,
      createdBy,
      videoLink: validatedVideoLink,
      imageUrl // Add image URL to MCQ document
    });

    const savedMcq = await newMcq.save();

    // Update user's last MCQ submission time
    user.lastMcqSubmission = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: "MCQ created successfully",
      mcq: savedMcq
    });

  } catch (error) {
    console.error("Error creating MCQ:", error);
    res.status(500).json({
      success: false,
      message: "Error creating MCQ",
      error: error.message
    });
  }
};

// Upload image for existing MCQ (Educator only)
export const uploadMcqImage = async (req, res) => {
  try {
    const { mcqId } = req.params;
    const userId = req.userId;

    // Validate user is educator
    const user = await User.findById(userId);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can upload images for MCQs"
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    // Find MCQ and verify ownership
    const mcq = await McqOfTheDay.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found"
      });
    }

    if (mcq.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only upload images for your own MCQs"
      });
    }

    // Construct the image URL relative to the server
    const imageUrl = `/uploads/mcq/${req.file.filename}`;

    // Update MCQ with image URL
    mcq.imageUrl = imageUrl;
    await mcq.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error("Error uploading MCQ image:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message
    });
  }
};

// Remove image from MCQ (Educator only)
export const removeMcqImage = async (req, res) => {
  try {
    const { mcqId } = req.params;
    const userId = req.userId;

    // Validate user is educator
    const user = await User.findById(userId);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can remove images from MCQs"
      });
    }

    // Find MCQ and verify ownership
    const mcq = await McqOfTheDay.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found"
      });
    }

    if (mcq.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only remove images from your own MCQs"
      });
    }

    // Remove image URL from MCQ
    mcq.imageUrl = null;
    await mcq.save();

    res.status(200).json({
      success: true,
      message: "Image removed successfully"
    });

  } catch (error) {
    console.error("Error removing MCQ image:", error);
    res.status(500).json({
      success: false,
      message: "Error removing image",
      error: error.message
    });
  }
};

// Get all MCQs created by educator
export const getEducatorMcqs = async (req, res) => {
  try {
    const createdBy = req.userId;

    // Validate user is educator
    const user = await User.findById(createdBy);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can access this endpoint"
      });
    }

    const mcqs = await McqOfTheDay.find({ createdBy })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      mcqs
    });

  } catch (error) {
    console.error("Error fetching educator MCQs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching MCQs",
      error: error.message
    });
  }
};

// Get today's MCQ for students
export const getTodayMcq = async (req, res) => {
  try {
    const studentId = req.userId;

    // Validate user is student
    const user = await User.findById(studentId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "Only students can access this endpoint"
      });
    }

    // Get the latest MCQ (today's MCQ)
    const todayMcq = await McqOfTheDay.findOne()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    if (!todayMcq) {
      return res.status(404).json({
        success: false,
        message: "No MCQ available for today"
      });
    }

    // Check if student has already attempted this MCQ
    const existingResponse = await StudentMcqResponse.findOne({
      studentId,
      mcqId: todayMcq._id
    });

    // Don't send correct answer to prevent cheating
    const mcqForStudent = {
      _id: todayMcq._id,
      subject: todayMcq.subject,
      chapter: todayMcq.chapter,
      topic: todayMcq.topic,
      question: todayMcq.question,
      options: todayMcq.options,
      videoLink: todayMcq.videoLink,
      imageUrl: todayMcq.imageUrl, // Include image URL in response
      createdBy: todayMcq.createdBy,
      createdAt: todayMcq.createdAt,
      isAttempted: !!existingResponse,
      studentResponse: existingResponse ? {
        selectedAnswer: existingResponse.selectedAnswer,
        isCorrect: existingResponse.isCorrect,
        submittedAt: existingResponse.submittedAt
      } : null
    };

    res.status(200).json({
      success: true,
      mcq: mcqForStudent
    });

  } catch (error) {
    console.error("Error fetching today's MCQ:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching today's MCQ",
      error: error.message
    });
  }
};

// Submit MCQ answer (Student only)
export const submitMcqAnswer = async (req, res) => {
  try {
    const { mcqId, selectedAnswer, timeSpent } = req.body;
    const studentId = req.userId;

    // Validate user is student
    const user = await User.findById(studentId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "Only students can submit MCQ answers"
      });
    }

    // Validate input
    if (!mcqId || !selectedAnswer) {
      return res.status(400).json({
        success: false,
        message: "MCQ ID and selected answer are required"
      });
    }

    // Check if MCQ exists
    const mcq = await McqOfTheDay.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found"
      });
    }

    // Check if student has already submitted for this MCQ
    const existingResponse = await StudentMcqResponse.findOne({
      studentId,
      mcqId
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted an answer for this MCQ"
      });
    }

    // Check if selected answer is correct
    const isCorrect = selectedAnswer === mcq.correctAnswer;

    // Save student response with time spent
    const newResponse = new StudentMcqResponse({
      studentId,
      mcqId,
      selectedAnswer,
      isCorrect,
      timeSpent: timeSpent || 0
    });

    const savedResponse = await newResponse.save();

    res.status(201).json({
      success: true,
      message: "Answer submitted successfully",
      response: {
        ...savedResponse.toObject(),
        correctAnswer: mcq.correctAnswer
      }
    });

  } catch (error) {
    console.error("Error submitting MCQ answer:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting answer",
      error: error.message
    });
  }
};

// Get student's MCQ results
export const getStudentMcqResults = async (req, res) => {
  try {
    const studentId = req.userId;

    // Validate user is student
    const user = await User.findById(studentId);
    if (!user || user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "Only students can access this endpoint"
      });
    }

    const results = await StudentMcqResponse.find({ studentId })
      .select('+timeSpent')
      .populate({
        path: 'mcqId',
        select: 'subject chapter topic question options correctAnswer createdAt imageUrl', // Include imageUrl in populate
        populate: {
          path: 'createdBy',
          select: 'name'
        }
      })
      .sort({ submittedAt: -1 });

    // Calculate summary statistics
    const totalAttempts = results.length;
    const correctAnswers = results.filter(result => result.isCorrect).length;
    const accuracyPercentage = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

    res.status(200).json({
      success: true,
      results,
      summary: {
        totalAttempts,
        correctAnswers,
        wrongAnswers: totalAttempts - correctAnswers,
        accuracyPercentage
      }
    });

  } catch (error) {
    console.error("Error fetching student MCQ results:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching MCQ results",
      error: error.message
    });
  }
};

// Add YouTube video link to MCQ (Educator only)
export const addVideoLink = async (req, res) => {
  try {
    const { mcqId, videoLink } = req.body;
    const userId = req.userId;

    // Validate user is educator
    const user = await User.findById(userId);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can add video links"
      });
    }

    // Validate input
    if (!mcqId || !videoLink) {
      return res.status(400).json({
        success: false,
        message: "MCQ ID and video link are required"
      });
    }

    // Validate YouTube URL format
    const isValidYouTubeUrl = (url) => {
      try {
        const urlObj = new URL(url);
        const host = urlObj.hostname;
        const pathname = urlObj.pathname;
        const searchParams = urlObj.searchParams;
        
        // Check if it's a YouTube domain (allow both http and https, with or without www)
        if (!host.includes('youtube.com') && !host.includes('youtu.be')) {
          return false;
        }
        
        // For youtu.be short URLs
        if (host.includes('youtu.be') && pathname.length > 1) {
          return true;
        }
        
        // For youtube.com URLs, check if it has a video parameter
        if (host.includes('youtube.com') && pathname === '/watch' && searchParams.has('v')) {
          return true;
        }
        
        return false;
      } catch (e) {
        // If URL parsing fails, it's not a valid URL
        return false;
      }
    };
    
    if (!isValidYouTubeUrl(videoLink)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid YouTube URL"
      });
    }

    // Find MCQ and verify ownership
    const mcq = await McqOfTheDay.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found"
      });
    }

    if (mcq.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only add video links to your own MCQs"
      });
    }

    // Update MCQ with video link
    mcq.videoLink = videoLink;
    await mcq.save();

    res.status(200).json({
      success: true,
      message: "Video link added successfully",
      mcq: mcq
    });

  } catch (error) {
    console.error("Error adding video link:", error);
    res.status(500).json({
      success: false,
      message: "Error adding video link",
      error: error.message
    });
  }
};

// Remove YouTube video link from MCQ (Educator only)
export const removeVideoLink = async (req, res) => {
  try {
    const { mcqId } = req.params;
    const userId = req.userId;

    // Validate user is educator
    const user = await User.findById(userId);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can remove video links"
      });
    }

    // Find MCQ and verify ownership
    const mcq = await McqOfTheDay.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ not found"
      });
    }

    if (mcq.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only remove video links from your own MCQs"
      });
    }

    // Remove video link
    mcq.videoLink = null;
    await mcq.save();

    res.status(200).json({
      success: true,
      message: "Video link removed successfully",
      mcq: mcq
    });

  } catch (error) {
    console.error("Error removing video link:", error);
    res.status(500).json({
      success: false,
      message: "Error removing video link",
      error: error.message
    });
  }
};

// Check if educator can submit a new MCQ
export const canSubmitMcq = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate user is educator
    const user = await User.findById(userId);
    if (!user || user.role !== 'educator') {
      return res.status(403).json({
        success: false,
        message: "Only educators can access this endpoint"
      });
    }

    // Check if educator has submitted an MCQ within the last 24 hours
    if (user.lastMcqSubmission) {
      const now = new Date();
      const lastSubmission = new Date(user.lastMcqSubmission);
      const timeDiff = now - lastSubmission;
      const hoursSinceLastSubmission = timeDiff / (1000 * 60 * 60);
      
      if (hoursSinceLastSubmission < 24) {
        const timeLeft = (24 * 60 * 60 * 1000) - timeDiff; // Time left in milliseconds
        return res.status(200).json({
          success: true,
          canSubmit: false,
          timeLeft: timeLeft,
          message: "You can only submit one MCQ of the Day every 24 hours. Please try again later."
        });
      }
    }

    res.status(200).json({
      success: true,
      canSubmit: true
    });

  } catch (error) {
    console.error("Error checking submission eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Error checking submission eligibility",
      error: error.message
    });
  }
};