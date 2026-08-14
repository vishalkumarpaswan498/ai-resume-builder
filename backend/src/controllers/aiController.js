const OLLAMA_URL =
  "http://localhost:11434/api/generate";

const OLLAMA_MODEL = "llama3.2";

// =====================================================
// Ollama Helper
// =====================================================

const generateWithOllama = async (
  prompt,
  format = null
) => {
  const body = {
    model: OLLAMA_MODEL,
    prompt,
    stream: false,
  };

  if (format) {
    body.format = format;
  }

  const response = await fetch(
    OLLAMA_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error(
      "Ollama returned an empty response"
    );
  }

  return data.response.trim();
};

// =====================================================
// Extract JSON Safely
// =====================================================

const extractJsonObject = (content) => {
  let cleaned = content.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1
  ) {
    throw new Error(
      "No JSON object found in AI response"
    );
  }

  return cleaned.slice(
    firstBrace,
    lastBrace + 1
  );
};

// =====================================================
// Generate Resume Content
// =====================================================

export const generateResumeContent = async (
  req,
  res
) => {
  try {
    const {
      jobDescription,
      skills = [],
      projects = [],
      experience = [],
    } = req.body;

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        message:
          "Job description is required",
      });
    }

    const prompt = `
You are an expert professional resume writer.

Generate resume content based ONLY on the target job description and the candidate's existing information.

JOB DESCRIPTION:
${jobDescription}

CURRENT SKILLS:
${skills.join(", ")}

CURRENT PROJECTS:
${JSON.stringify(projects)}

CURRENT EXPERIENCE:
${JSON.stringify(experience)}

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "summary": "professional resume summary",
  "skills": [
    "skill1",
    "skill2",
    "skill3"
  ],
  "projectSuggestions": [
    {
      "name": "Project name",
      "description": "strong professional project description",
      "technologies": [
        "technology1",
        "technology2"
      ]
    }
  ],
  "experienceSuggestions": [
    "strong resume bullet point 1",
    "strong resume bullet point 2"
  ]
}

Rules:

- Never invent a company.
- Never invent employment.
- Never invent experience.
- Never invent a degree.
- Never invent certifications.
- Never invent achievements.
- Never invent percentages or metrics.
- Never mention a company unless it exists in CURRENT EXPERIENCE.
- Improve the candidate's existing information.
- Keep the summary concise.
- Use ATS-friendly language.
- Focus on relevant keywords from the job description.
- If CURRENT EXPERIENCE is empty, return experienceSuggestions as [].
- Return ONLY JSON.
- Do not use markdown.
- Do not use code fences.
- Do not add explanations.
`;

    const content =
      await generateWithOllama(
        prompt,
        "json"
      );

    if (!content) {
      return res.status(500).json({
        message:
          "AI did not return any content",
      });
    }

    let result;

    try {
      const jsonText =
        extractJsonObject(content);

      result = JSON.parse(jsonText);
    } catch (error) {
      console.error(
        "Invalid Ollama JSON:",
        content
      );

      return res.status(500).json({
        message:
          "AI returned invalid JSON",
        error:
          error instanceof Error
            ? error.message
            : "Invalid JSON response",
        rawResponse: content,
      });
    }

    return res.status(200).json({
      message:
        "Resume content generated successfully",
      result,
    });
  } catch (error) {
    console.error(
      "AI Resume Generation Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to generate resume content",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// =====================================================
// Generate Cover Letter
// =====================================================

export const generateCoverLetter = async (
  req,
  res
) => {
  try {
    const {
      jobDescription,
      resume = {},
    } = req.body;

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        message:
          "Job description is required",
      });
    }

    const prompt = `
You are an expert professional cover letter writer.

Create a professional, concise, ATS-friendly cover letter based ONLY on the candidate information provided below.

CANDIDATE RESUME:
${JSON.stringify(resume)}

JOB DESCRIPTION:
${jobDescription}

Requirements:

- Do not invent companies.
- Do not invent experience.
- Do not invent achievements.
- Do not invent degrees.
- Do not invent certifications.
- Use only information present in the resume.
- Tailor the letter to the job description.
- Use professional and natural language.
- Write 4 to 6 short paragraphs.
- Avoid exaggerated claims.
- Do not use placeholders.
- Do not add a fake employer name.
- Return ONLY the cover letter text.
`;

    const coverLetter =
      await generateWithOllama(
        prompt
      );

    if (!coverLetter) {
      return res.status(500).json({
        message:
          "AI did not generate a cover letter",
      });
    }

    return res.status(200).json({
      message:
        "Cover letter generated successfully",
      coverLetter,
    });
  } catch (error) {
    console.error(
      "Cover Letter Generation Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to generate cover letter",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

// =====================================================
// Generate Interview Questions
// =====================================================

export const generateInterviewQuestions = async (
  req,
  res
) => {
  try {
    const {
      jobDescription,
      resume = {},
    } = req.body;

    if (
      !jobDescription ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        message:
          "Job description is required",
      });
    }

    const prompt = `
You are an expert technical and HR interview coach.

Generate realistic interview questions based ONLY on the candidate's resume and target job description.

CANDIDATE RESUME:
${JSON.stringify(resume)}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "questions": [
    {
      "question": "Tell me about yourself.",
      "category": "HR"
    },
    {
      "question": "What technical skills from your resume are most relevant to this role?",
      "category": "Technical"
    },
    {
      "question": "Explain one project from your resume and your contribution.",
      "category": "Project"
    },
    {
      "question": "Describe a difficult problem you solved.",
      "category": "Behavioral"
    }
  ]
}

Rules:

- Generate exactly 10 questions.
- Mix HR, Technical, Project and Behavioral questions.
- Tailor questions to the job description.
- Tailor questions to the candidate's actual resume.
- Do not invent companies.
- Do not invent experience.
- Do not invent skills.
- Do not invent projects.
- Do not invent degrees.
- Do not invent certifications.
- Do not assume missing information.
- Keep questions realistic.
- Return ONLY JSON.
- Do not use markdown.
- Do not use code fences.
`;

    const content =
      await generateWithOllama(
        prompt,
        "json"
      );

    if (!content) {
      return res.status(500).json({
        message:
          "AI did not return interview questions",
      });
    }

    let result;

    try {
      const jsonText =
        extractJsonObject(content);

      result = JSON.parse(jsonText);
    } catch (error) {
      console.error(
        "Invalid Interview JSON:",
        content
      );

      return res.status(500).json({
        message:
          "AI returned invalid interview JSON",
        error:
          error instanceof Error
            ? error.message
            : "Invalid JSON response",
        rawResponse: content,
      });
    }

    if (
      !result.questions ||
      !Array.isArray(result.questions)
    ) {
      return res.status(500).json({
        message:
          "AI returned invalid interview questions",
      });
    }

    return res.status(200).json({
      message:
        "Interview questions generated successfully",
      questions:
        result.questions,
    });
  } catch (error) {
    console.error(
      "Interview Coach Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to generate interview questions",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};


// =====================================================
// Evaluate Interview Answer
// =====================================================

export const evaluateInterviewAnswer = async (
  req,
  res
) => {
  try {
    const {
      question,
      answer,
      jobDescription,
      resume = {},
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Interview question is required",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        message: "Interview answer is required",
      });
    }

    const prompt = `
You are an expert interview coach.

Evaluate the candidate's interview answer based on
the question, job description, and candidate resume.

INTERVIEW QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

JOB DESCRIPTION:
${jobDescription || "Not provided"}

CANDIDATE RESUME:
${JSON.stringify(resume)}

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "score": 8,
  "feedback": "Overall feedback about the answer.",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "betterAnswer": "A stronger example answer based only on the candidate's actual information."
}

Rules:

- Score must be an integer from 0 to 10.
- Do not invent companies, experience, projects, skills, degrees or achievements.
- Evaluate relevance, clarity, structure, confidence and technical accuracy where applicable.
- Be constructive and realistic.
- The better answer must only use information actually present in the resume or candidate answer.
- Do not add fake achievements or fake metrics.
- Return ONLY JSON.
- Do not use markdown.
- Do not use code fences.
`;

    const content = await generateWithOllama(
      prompt,
      "json"
    );

    if (!content) {
      return res.status(500).json({
        message:
          "AI did not return interview feedback",
      });
    }

    let result;

    try {
      const jsonText =
        extractJsonObject(content);

      result = JSON.parse(jsonText);
    } catch (error) {
      console.error(
        "Invalid Interview Evaluation JSON:",
        content
      );

      return res.status(500).json({
        message:
          "AI returned invalid interview feedback",
        rawResponse: content,
      });
    }

    return res.status(200).json({
      message:
        "Interview answer evaluated successfully",
      result,
    });
  } catch (error) {
    console.error(
      "Interview Evaluation Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to evaluate interview answer",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};