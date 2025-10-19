import mongoose from "mongoose";

const mcqOfTheDaySchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true
    },
    chapter: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      type: String,
      required: true,
      trim: true
    }],
    correctAnswer: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    videoLink: {
      type: String,
      trim: true,
      default: null
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null
    }
  },
  { 
    timestamps: true 
  }
);

// Validation to ensure at least 4 options
mcqOfTheDaySchema.pre('save', function(next) {
  if (this.options.length < 4) {
    const error = new Error('At least 4 options are required');
    return next(error);
  }
  
  // Check that all options are non-empty
  const nonEmptyOptions = this.options.filter(option => option && option.trim() !== '');
  if (nonEmptyOptions.length < 4) {
    const error = new Error('All 4 options must be filled');
    return next(error);
  }
  
  // Validate that correctAnswer is one of the options
  if (!this.options.includes(this.correctAnswer)) {
    const error = new Error('Correct answer must be one of the provided options');
    return next(error);
  }
  
  next();
});

const McqOfTheDay = mongoose.model("McqOfTheDay", mcqOfTheDaySchema);
export default McqOfTheDay;