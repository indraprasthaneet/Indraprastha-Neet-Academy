import mongoose from "mongoose";

const studentQuestionAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    // For objective questions
    selectedOption: {
      type: String,
      trim: true
    },
    // For subjective questions
    studentAnswer: {
      type: String,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    },
    score: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true 
  }
);

const StudentQuestionAttempt = mongoose.model("StudentQuestionAttempt", studentQuestionAttemptSchema);
export default StudentQuestionAttempt;