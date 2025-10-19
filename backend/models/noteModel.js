import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
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
    title: {
      type: String,
      default: ""
    },
    noteText: {
      type: String,
      required: true
    },
    images: [{
      type: String,
      trim: true
    }],
    educatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["pyq", "question-bank"],
      default: "pyq"
    }
  },
  { 
    timestamps: true 
  }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;