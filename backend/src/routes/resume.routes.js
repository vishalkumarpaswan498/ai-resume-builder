import express from "express";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();


// ========================================
// Create Resume
// ========================================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            personalInfo,
            summary,
            skills,
            education,
            experience,
            projects,
            certifications,
        } = req.body;

        // Check title
        if (!title) {
            return res.status(400).json({
                message: "Resume title is required",
            });
        }

        // Create resume
        const resume = await Resume.create({
            userId: req.user.userId,
            title,
            personalInfo,
            summary,
            skills,
            education,
            experience,
            projects,
            certifications,
        });

        res.status(201).json({
            message: "Resume created successfully",
            resume,
        });

    } catch (error) {
        console.error("Create Resume Error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});

// ========================================
// Get My Resumes
// ========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const resumes = await Resume.find({
            userId: req.user.userId,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: resumes.length,
            resumes,
        });

    } catch (error) {
        console.error("Get Resumes Error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});


// ========================================
// Get Single Resume
// ========================================
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found",
            });
        }

        res.status(200).json({
            resume,
        });

    } catch (error) {
        console.error("Get Single Resume Error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});

// ========================================
// Update Resume
// ========================================
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            personalInfo,
            summary,
            skills,
            education,
            experience,
            projects,
            certifications,
        } = req.body;

        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found",
            });
        }

        // Update fields
        if (title !== undefined) resume.title = title;
        if (personalInfo !== undefined) resume.personalInfo = personalInfo;
        if (summary !== undefined) resume.summary = summary;
        if (skills !== undefined) resume.skills = skills;
        if (education !== undefined) resume.education = education;
        if (experience !== undefined) resume.experience = experience;
        if (projects !== undefined) resume.projects = projects;
        if (certifications !== undefined) {
            resume.certifications = certifications;
        }

        await resume.save();

        res.status(200).json({
            message: "Resume updated successfully",
            resume,
        });

    } catch (error) {
        console.error("Update Resume Error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});

// ========================================
// Delete Resume
// ========================================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!resume) {
            return res.status(404).json({
                message: "Resume not found",
            });
        }

        await Resume.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Resume deleted successfully",
        });

    } catch (error) {
        console.error("Delete Resume Error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
});


export default router;