import fs from "fs";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import Resume from "../models/Resume.js";


const extractTextFromFile = async (filePath, mimetype) => {
  if (mimetype === "application/pdf") {
    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return result.value;
  }

  throw new Error("Only PDF and DOCX files are supported");
};
const cleanText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getKeywords = (text) => {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "are",
    "you",
    "your",
    "our",
    "will",
    "have",
    "has",
    "had",
    "job",
    "role",
    "work",
    "working",
    "experience",
    "years",
    "using",
    "required",
    "requirements",
    "preferred",
    "looking",
    "about",
    "into",
    "their",
    "they",
    "who",
    "what",
    "how",
    "can",
    "all",
    "but",
    "not",
    "should",
    "must",
    "candidate",
    "candidates",
    "knowledge",
    "ability",
    "skills",
    "skill",
    "team",
    "teams",
    "company",
    "position",
    "responsibilities",
    "including",
    "such",
    "more",
    "than",
    "you'll",
    "we",
    "our",
    "us",
  ]);

  const normalizedText = text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = normalizedText
    .split(" ")
    .filter(
      (word) =>
        word.length >= 3 &&
        !stopWords.has(word) &&
        !/^\d+$/.test(word)
    );

  return [...new Set(words)];
};

const normalizeKeyword = (keyword) => {
  const normalized = keyword
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "");

  const aliases = {
    "react.js": "react",
    "reactjs": "react",

    "nodejs": "node.js",
    "node": "node.js",

    "expressjs": "express",

    "mongodb": "mongodb",
    "mongo": "mongodb",

    "javascript": "javascript",
    "js": "javascript",

    "typescript": "typescript",
    "ts": "typescript",

    "rest": "rest api",
    "restful": "rest api",
    "apis": "api",
  };

  return aliases[normalized] || normalized;
};

export const analyzeResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    filePath = req.file.path;

    // Extract resume text
    const resumeText = await extractTextFromFile(
      filePath,
      req.file.mimetype
    );

    if (!resumeText.trim()) {
      return res.status(400).json({
        message: "Could not extract text from resume",
      });
    }

    const cleanedResume = cleanText(resumeText);
    const cleanedJobDescription = cleanText(jobDescription);

    // Get keywords
   const jobKeywords = getKeywords(
  cleanedJobDescription
).map(normalizeKeyword);

   const resumeWords = new Set(
  cleanedResume
    .split(" ")
    .map(normalizeKeyword)
);

const uniqueJobKeywords = [
  ...new Set(jobKeywords),
];

    // Find matched and missing keywords
    const matchedKeywords = uniqueJobKeywords.filter(
  (keyword) => resumeWords.has(keyword)
);

const missingKeywords = uniqueJobKeywords
  .filter((keyword) => !resumeWords.has(keyword))
  .slice(0, 15);

    // Keyword score
    const keywordScore =
  uniqueJobKeywords.length > 0
    ? Math.round(
        (matchedKeywords.length /
          uniqueJobKeywords.length) *
          100
      )
    : 0;

    // Basic formatting score
    let formattingScore = 100;

    if (resumeText.length < 500) {
      formattingScore -= 20;
    }

    if (!resumeText.includes("Skills")) {
      formattingScore -= 10;
    }

    if (!resumeText.includes("Education")) {
      formattingScore -= 10;
    }

    if (
      !resumeText.includes("Experience") &&
      !resumeText.includes("Work")
    ) {
      formattingScore -= 15;
    }

    formattingScore = Math.max(formattingScore, 0);

    // Skills score
    const skillWords = [
      "javascript",
      "typescript",
      "react",
      "node",
      "node.js",
      "express",
      "mongodb",
      "sql",
      "python",
      "java",
      "c++",
      "html",
      "css",
      "tailwind",
      "docker",
      "aws",
      "git",
      "github",
      "rest",
      "api",
    ];

    const detectedSkills = skillWords.filter(
  (skill) => cleanedResume.includes(skill)
);

const jobSkills = skillWords.filter(
  (skill) => cleanedJobDescription.includes(skill)
);

const matchedSkills = jobSkills.filter(
  (skill) => detectedSkills.includes(skill)
);

const skillsScore =
  jobSkills.length > 0
    ? Math.round(
        (matchedSkills.length / jobSkills.length) * 100
      )
    : detectedSkills.length > 0
    ? Math.min(100, detectedSkills.length * 8)
    : 0;
    // Experience score
    let experienceScore = 60;

    if (
      cleanedResume.includes("experience") ||
      cleanedResume.includes("internship") ||
      cleanedResume.includes("developer")
    ) {
      experienceScore = 85;
    }

    if (
      cleanedResume.includes("project") ||
      cleanedResume.includes("projects")
    ) {
      experienceScore += 10;
    }

    experienceScore = Math.min(experienceScore, 100);

    // Final ATS score
    const atsScore = Math.round(
      keywordScore * 0.4 +
        formattingScore * 0.2 +
        skillsScore * 0.2 +
        experienceScore * 0.2
    );

    // Suggestions
    const suggestions = [];

    if (keywordScore < 70) {
      suggestions.push(
        "Add relevant keywords from the job description to your resume."
      );
    }

    if (formattingScore < 80) {
      suggestions.push(
        "Improve your resume structure and make sure important sections are clearly visible."
      );
    }

    if (skillsScore < 70) {
      suggestions.push(
        "Add relevant technical skills that match the job description."
      );
    }

    if (experienceScore < 70) {
      suggestions.push(
        "Add relevant projects, internships, or work experience."
      );
    }

    if (resumeText.length < 1000) {
      suggestions.push(
        "Your resume appears short. Add stronger project and achievement details."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Your resume has a strong ATS structure. Continue tailoring it to the specific job."
      );
    }

    return res.status(200).json({
      message: "ATS analysis completed",

      result: {
        atsScore,

        analysis: {
          keywords: keywordScore,
          formatting: formattingScore,
          skills: skillsScore,
          experience: experienceScore,
        },

        matchedKeywords: matchedKeywords.slice(0, 30),

        missingKeywords,

        detectedSkills,

        suggestions,

        resumeTextLength: resumeText.length,
      },
    });
  } catch (error) {
    console.error("ATS Analysis Error:", error);

    return res.status(500).json({
      message: "Failed to analyze resume",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  } finally {
    // Delete uploaded temporary file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};


export const analyzeSavedResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const resumeText = [
      resume.title,
      resume.personalInfo?.fullName,
      resume.personalInfo?.email,
      resume.personalInfo?.location,
      resume.summary,

      ...(resume.skills || []),

      ...(resume.education || []).flatMap((item) => [
        item.degree,
        item.institution,
        item.field,
        item.grade,
      ]),

      ...(resume.experience || []).flatMap((item) => [
        item.jobTitle,
        item.company,
        item.description,
      ]),

      ...(resume.projects || []).flatMap((item) => [
        item.name,
        item.description,
        ...(item.technologies || []),
      ]),

      ...(resume.certifications || []).flatMap((item) => [
        item.name,
        item.issuer,
      ]),
    ]
      .filter(Boolean)
      .join(" ");

    const cleanedResume = cleanText(resumeText);
    const cleanedJobDescription = cleanText(jobDescription);

    const jobKeywords = getKeywords(
  cleanedJobDescription
).map(normalizeKeyword);

const uniqueJobKeywords = [
  ...new Set(jobKeywords),
];

const resumeWords = new Set(
  cleanedResume
    .split(" ")
    .map(normalizeKeyword)
);

const matchedKeywords = uniqueJobKeywords.filter(
  (keyword) => resumeWords.has(keyword)
);

const missingKeywords = uniqueJobKeywords
  .filter((keyword) => !resumeWords.has(keyword))
  .slice(0, 15);

const keywordScore =
  uniqueJobKeywords.length > 0
    ? Math.round(
        (matchedKeywords.length /
          uniqueJobKeywords.length) *
          100
      )
    : 0;

    let formattingScore = 100;

    if (!resume.summary?.trim()) {
      formattingScore -= 15;
    }

    if (!resume.skills?.length) {
      formattingScore -= 10;
    }

    if (!resume.education?.length) {
      formattingScore -= 10;
    }

    if (!resume.projects?.length) {
      formattingScore -= 10;
    }

    formattingScore = Math.max(formattingScore, 0);

    const skillWords = [
      "javascript",
      "typescript",
      "react",
      "node",
      "node.js",
      "express",
      "mongodb",
      "sql",
      "python",
      "java",
      "c++",
      "html",
      "css",
      "tailwind",
      "docker",
      "aws",
      "git",
      "github",
      "rest",
      "api",
    ];

   const detectedSkills = skillWords.filter(
  (skill) => cleanedResume.includes(skill)
);

const jobSkills = skillWords.filter(
  (skill) => cleanedJobDescription.includes(skill)
);

const matchedSkills = jobSkills.filter(
  (skill) => detectedSkills.includes(skill)
);

const skillsScore =
  jobSkills.length > 0
    ? Math.round(
        (matchedSkills.length / jobSkills.length) * 100
      )
    : detectedSkills.length > 0
    ? Math.min(100, detectedSkills.length * 8)
    : 0;
    let experienceScore = 60;

    if (resume.experience?.length > 0) {
      experienceScore = 85;
    }

    if (resume.projects?.length > 0) {
      experienceScore += 10;
    }

    experienceScore = Math.min(
      experienceScore,
      100
    );

    const atsScore = Math.round(
      keywordScore * 0.4 +
        formattingScore * 0.2 +
        skillsScore * 0.2 +
        experienceScore * 0.2
    );

    const suggestions = [];

    if (keywordScore < 70) {
      suggestions.push(
        "Add relevant keywords from the job description to your resume."
      );
    }

    if (formattingScore < 80) {
      suggestions.push(
        "Complete missing resume sections and improve the overall structure."
      );
    }

    if (skillsScore < 70) {
      suggestions.push(
        "Add relevant technical skills that match the target job."
      );
    }

    if (experienceScore < 70) {
      suggestions.push(
        "Add relevant projects, internships, or professional experience."
      );
    }

    if (!resume.summary?.trim()) {
      suggestions.push(
        "Add a strong professional summary."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Your resume has a good ATS structure. Tailor it further to the specific job."
      );
    }

    return res.status(200).json({
      message: "Saved resume ATS analysis completed",

      result: {
        atsScore,

        analysis: {
          keywords: keywordScore,
          formatting: formattingScore,
          skills: skillsScore,
          experience: experienceScore,
        },

        matchedKeywords: matchedKeywords.slice(0, 30),

        missingKeywords,

        detectedSkills,

        suggestions,

        resumeTextLength: resumeText.length,
      },
    });
  } catch (error) {
    console.error(
      "Saved Resume ATS Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to analyze saved resume",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};