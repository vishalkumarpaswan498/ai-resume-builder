import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  generateResumeContent,
  generateCoverLetter,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
} from "../controllers/aiController.js";

const router = express.Router();

// ========================================
// AI Resume Generator
// ========================================
router.post(
  "/generate-resume",
  authMiddleware,
  generateResumeContent
);

// ========================================
// AI Cover Letter
// ========================================
router.post(
  "/generate-cover-letter",
  authMiddleware,
  generateCoverLetter
);

// ========================================
// AI Interview Questions
// ========================================
router.post(
  "/generate-interview",
  authMiddleware,
  generateInterviewQuestions
);

// ========================================
// AI Interview Answer Evaluation
// ========================================
router.post(
  "/evaluate-interview",
  authMiddleware,
  evaluateInterviewAnswer
);

export default router;