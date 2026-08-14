import express from "express";
import multer from "multer";
import path from "path";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  analyzeResume,
  analyzeSavedResume,
} from "../controllers/atsController.js";

const router = express.Router();

// ========================================
// Upload configuration
// ========================================

const uploadDir = "uploads/ats";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ========================================
// File filter
// ========================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF and DOCX files are allowed"),
      false
    );
  }
};

// ========================================
// Multer
// ========================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ========================================
// Analyze uploaded Resume
// ========================================

router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResume
);

// ========================================
// Analyze Saved Resume
// ========================================

router.post(
  "/analyze-saved/:id",
  authMiddleware,
  analyzeSavedResume
);

export default router;