import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createInterviewSession,
  updateInterviewSession,
  getInterviewSessions,
  getInterviewSession,
  deleteInterviewSession,
} from "../controllers/interviewController.js";

const router = express.Router();

// Create session
router.post(
  "/",
  authMiddleware,
  createInterviewSession
);

// Get all sessions
router.get(
  "/",
  authMiddleware,
  getInterviewSessions
);

// Get one session
router.get(
  "/:id",
  authMiddleware,
  getInterviewSession
);

// Update session
router.put(
  "/:id",
  authMiddleware,
  updateInterviewSession
);

// Delete session
router.delete(
  "/:id",
  authMiddleware,
  deleteInterviewSession
);

export default router;