import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  chapter: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  questions: [{
    text: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: String,
      required: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Test = mongoose.model("Test", TestSchema);
export default Test;