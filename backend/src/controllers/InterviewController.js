import mongoose from "mongoose";
import InterviewSession from "../models/InterviewSession.js";
import Resume from "../models/Resume.js";

// =====================================================
// Create Interview Session
// =====================================================

export const createInterviewSession = async (
  req,
  res
) => {
  try {
    const {
      resumeId,
      jobDescription,
      questions = [],
    } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        message: "Resume ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        message: "Invalid resume ID",
      });
    }

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    // Make sure resume belongs to current user
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const session = await InterviewSession.create({
      userId: req.user.userId,
      resumeId,
      jobDescription,
      totalQuestions: Array.isArray(questions)
        ? questions.length
        : 0,
      questions: Array.isArray(questions)
        ? questions
        : [],
      completedQuestions: 0,
      averageScore: 0,
      status: "in-progress",
    });

    return res.status(201).json({
      message:
        "Interview session created successfully",
      session,
    });
  } catch (error) {
    console.error(
      "Create Interview Session Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create interview session",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// =====================================================
// Update Interview Session
// =====================================================

export const updateInterviewSession = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid interview session ID",
      });
    }

    const {
      questions,
      status,
    } = req.body;

    const session =
      await InterviewSession.findOne({
        _id: id,
        userId: req.user.userId,
      });

    if (!session) {
      return res.status(404).json({
        message: "Interview session not found",
      });
    }

    // Update questions if provided
    if (Array.isArray(questions)) {
      session.questions = questions;

      session.totalQuestions =
        questions.length;

      const completedQuestions =
        questions.filter(
          (item) =>
            item.answer &&
            item.answer.trim() &&
            typeof item.score === "number"
        );

      session.completedQuestions =
        completedQuestions.length;

      if (
        completedQuestions.length > 0
      ) {
        const totalScore =
          completedQuestions.reduce(
            (sum, item) =>
              sum +
              Number(item.score || 0),
            0
          );

        session.averageScore =
          Number(
            (
              totalScore /
              completedQuestions.length
            ).toFixed(1)
          );
      } else {
        session.averageScore = 0;
      }
    }

    // Update status
    if (
      status === "in-progress" ||
      status === "completed"
    ) {
      session.status = status;

      if (status === "completed") {
        session.completedAt =
          new Date();
      }
    }

    await session.save();

    return res.status(200).json({
      message:
        "Interview session updated successfully",
      session,
    });
  } catch (error) {
    console.error(
      "Update Interview Session Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update interview session",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// =====================================================
// Get My Interview Sessions
// =====================================================

export const getInterviewSessions = async (
  req,
  res
) => {
  try {
    const sessions =
      await InterviewSession.find({
        userId: req.user.userId,
      })
        .populate(
          "resumeId",
          "title personalInfo.fullName"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error(
      "Get Interview Sessions Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch interview sessions",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// =====================================================
// Get Single Interview Session
// =====================================================

export const getInterviewSession = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid interview session ID",
      });
    }

    const session =
      await InterviewSession.findOne({
        _id: id,
        userId: req.user.userId,
      }).populate(
        "resumeId",
        "title personalInfo.fullName"
      );

    if (!session) {
      return res.status(404).json({
        message: "Interview session not found",
      });
    }

    return res.status(200).json({
      session,
    });
  } catch (error) {
    console.error(
      "Get Interview Session Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch interview session",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// =====================================================
// Delete Interview Session
// =====================================================

export const deleteInterviewSession = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid interview session ID",
      });
    }

    const session =
      await InterviewSession.findOne({
        _id: id,
        userId: req.user.userId,
      });

    if (!session) {
      return res.status(404).json({
        message: "Interview session not found",
      });
    }

    await InterviewSession.findByIdAndDelete(id);

    return res.status(200).json({
      message:
        "Interview session deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Interview Session Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete interview session",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};