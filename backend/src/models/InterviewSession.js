import mongoose from "mongoose";

const interviewQuestionSchema =
  new mongoose.Schema(
    {
      question: {
        type: String,
        required: true,
        trim: true,
      },

      category: {
        type: String,
        enum: [
          "HR",
          "Technical",
          "Project",
          "Behavioral",
        ],
        required: true,
      },

      answer: {
        type: String,
        default: "",
        trim: true,
      },

      score: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },

      feedback: {
        type: String,
        default: "",
        trim: true,
      },

      strengths: {
        type: [String],
        default: [],
      },

      improvements: {
        type: [String],
        default: [],
      },

      betterAnswer: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const interviewSessionSchema =
  new mongoose.Schema(
    {
      // Session kis user ki hai
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // Kis resume ke saath interview practice hui
      resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resume",
        required: true,
      },

      // Target job description
      jobDescription: {
        type: String,
        required: true,
        trim: true,
      },

      // Total questions
      totalQuestions: {
        type: Number,
        default: 0,
      },

      // Average score
      averageScore: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },

      // Completed questions count
      completedQuestions: {
        type: Number,
        default: 0,
      },

      // Interview questions + answers + feedback
      questions: {
        type: [interviewQuestionSchema],
        default: [],
      },

      // Session status
      status: {
        type: String,
        enum: [
          "in-progress",
          "completed",
        ],
        default: "in-progress",
      },

      // Completed time
      completedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const InterviewSession =
  mongoose.model(
    "InterviewSession",
    interviewSessionSchema
  );

export default InterviewSession;