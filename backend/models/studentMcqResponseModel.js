import mongoose from "mongoose";

const studentMcqResponseSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mcqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'McqOfTheDay',
      required: true
    },
    selectedAnswer: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeSpent: {
      type: Number,
      default: 0 // Time spent in seconds
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true 
  }
);

// Compound index to ensure one response per student per MCQ
studentMcqResponseSchema.index({ studentId: 1, mcqId: 1 }, { unique: true });

const StudentMcqResponse = mongoose.model("StudentMcqResponse", studentMcqResponseSchema);
export default StudentMcqResponse;