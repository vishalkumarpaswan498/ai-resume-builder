import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import atsRoutes from "./routes/ats.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();

// =====================================================
// Security Headers
// =====================================================

app.use(helmet());

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  process.env.FRONTEND_URL,
].filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests such as Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,
  })
);

// =====================================================
// Body Parser
// =====================================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

app.use(cookieParser());

// =====================================================
// General API Rate Limit
// =====================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// =====================================================
// AI Rate Limit
// =====================================================

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many AI requests. Please try again later.",
  },
});

// =====================================================
// Test API
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "AI Resume Builder Backend Running 🚀",
  });
});

// =====================================================
// Routes
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/resumes",
  resumeRoutes
);

app.use(
  "/api/ats",
  atsRoutes
);

app.use(
  "/api/ai",
  aiLimiter,
  aiRoutes
);

app.use(
  "/api/interviews",
  interviewRoutes
);

// =====================================================
// 404 Handler
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =====================================================
// Global Error Handler
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "Global API Error:",
      err
    );

    // CORS error
    if (
      err.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        message:
          "Origin is not allowed",
      });
    }

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
);

export default app;