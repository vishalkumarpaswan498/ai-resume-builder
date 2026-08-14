import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        // Resume किस user का है
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Resume title
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Personal Information
        personalInfo: {
            fullName: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
            },
            phone: {
                type: String,
                trim: true,
            },
            location: {
                type: String,
                trim: true,
            },
            linkedin: {
                type: String,
                trim: true,
            },
            github: {
                type: String,
                trim: true,
            },
            portfolio: {
                type: String,
                trim: true,
            },
        },

        // Professional Summary
        summary: {
            type: String,
            trim: true,
        },

        // Skills
        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        // Education
        education: [
            {
                degree: {
                    type: String,
                    trim: true,
                },
                institution: {
                    type: String,
                    trim: true,
                },
                field: {
                    type: String,
                    trim: true,
                },
                startYear: {
                    type: String,
                    trim: true,
                },
                endYear: {
                    type: String,
                    trim: true,
                },
                grade: {
                    type: String,
                    trim: true,
                },
            },
        ],

        // Work Experience
        experience: [
            {
                jobTitle: {
                    type: String,
                    trim: true,
                },
                company: {
                    type: String,
                    trim: true,
                },
                startDate: {
                    type: String,
                    trim: true,
                },
                endDate: {
                    type: String,
                    trim: true,
                },
                description: {
                    type: String,
                    trim: true,
                },
            },
        ],

        // Projects
        projects: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                description: {
                    type: String,
                    trim: true,
                },
                technologies: [
                    {
                        type: String,
                        trim: true,
                    },
                ],
                link: {
                    type: String,
                    trim: true,
                },
            },
        ],

        // Certifications
        certifications: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                issuer: {
                    type: String,
                    trim: true,
                },
                year: {
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;