import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    class: {
      type: String,
      required: true,
      enum: ["11", "12"]
    },
    subject: {
      type: String,
      required: true
    },
    chapter: {
      type: String,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      required: true,
      enum: ["subjective", "objective"]
    },
    // For objective questions
    options: [{
      type: String,
      trim: true
    }],
    correctAnswer: {
      type: String,
      trim: true
    },
    // For subjective questions
    answerText: {
      type: String,
      trim: true
    },
    educatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Validation to ensure at least 4 options for objective questions
    // and answer text for subjective questions
  },
  { 
    timestamps: true 
  }
);

// Pre-save validation
questionSchema.pre('save', function(next) {
  if (this.questionType === 'objective') {
    // Validate objective question
    if (!this.options || this.options.length < 2) {
      const error = new Error('Objective questions must have at least 2 options');
      return next(error);
    }
    
    if (!this.correctAnswer) {
      const error = new Error('Objective questions must have a correct answer');
      return next(error);
    }
    
    // Validate that correctAnswer is one of the options
    if (!this.options.includes(this.correctAnswer)) {
      const error = new Error('Correct answer must be one of the provided options');
      return next(error);
    }
  } else if (this.questionType === 'subjective') {
    // Validate subjective question
    if (!this.answerText) {
      const error = new Error('Subjective questions must have an answer text');
      return next(error);
    }
  }
  
  next();
});

const Question = mongoose.model("Question", questionSchema);
export default Question;