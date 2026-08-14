const API_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";

type SavedResume = {
  _id: string;
  title: string;
  personalInfo?: {
    fullName?: string;
  };
  summary?: string;
  skills?: string[];
  experience?: unknown[];
  projects?: unknown[];
};

type InterviewQuestion = {
  question: string;
  category:
    | "HR"
    | "Technical"
    | "Project"
    | "Behavioral";
};

type InterviewFeedback = {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
};

function InterviewCoach() {
  const [resumes, setResumes] = useState<
    SavedResume[]
  >([]);

  const [selectedResumeId, setSelectedResumeId] =
    useState("");

  const [jobDescription, setJobDescription] =
    useState("");

  const [questions, setQuestions] = useState<
    InterviewQuestion[]
  >([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] =
    useState<InterviewFeedback | null>(null);

  const [loadingResumes, setLoadingResumes] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [evaluating, setEvaluating] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [sessionId, setSessionId] = useState("");
  // =====================================================
  // Fetch Saved Resumes
  // =====================================================

  useEffect(() => {
    const fetchResumes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoadingResumes(false);
        return;
      }

      try {
        const response = await fetch(
  `${API_URL}/api/resumes`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load resumes"
          );
        }

        const resumeList =
          data.resumes || [];

        setResumes(resumeList);

        if (resumeList.length > 0) {
          setSelectedResumeId(
            resumeList[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Interview Resume Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load resumes"
        );
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, []);

  // =====================================================
  // Generate Interview Questions
  // =====================================================

  const handleGenerateQuestions =
    async () => {
      if (!selectedResumeId) {
        setError("Please select a resume.");
        return;
      }

      if (!jobDescription.trim()) {
        setError(
          "Please paste the job description."
        );
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const selectedResume =
        resumes.find(
          (resume) =>
            resume._id ===
            selectedResumeId
        );

      if (!selectedResume) {
        setError(
          "Selected resume not found."
        );
        return;
      }

      try {
        setGenerating(true);
        setError("");
        setSuccess("");
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setAnswer("");
        setFeedback(null);

        const response = await fetch(
          `${API_URL}/api/ai/generate-interview`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              jobDescription,
              resume: selectedResume,
            }),
          }
        );

        const responseText =
          await response.text();

        console.log(
          "Interview Status:",
          response.status
        );

        console.log(
          "Interview Response:",
          responseText
        );

        if (!response.ok) {
          let message =
            "Failed to generate interview questions";

          try {
            const data =
              JSON.parse(responseText);

            message =
              data.message ||
              message;
          } catch {
            message =
              responseText ||
              message;
          }

          throw new Error(message);
        }

        const data =
          JSON.parse(responseText);

        if (
          !Array.isArray(
            data.questions
          )
        ) {
          throw new Error(
            "AI returned invalid interview questions"
          );
        }

        setQuestions(
          data.questions
        );

        // Create interview session in MongoDB
const sessionResponse = await fetch(
  `${API_URL}/api/interviews`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      resumeId: selectedResumeId,
      jobDescription,
      questions: data.questions,
    }),
  }
);

const sessionResponseText =
  await sessionResponse.text();

console.log(
  "Interview Session Status:",
  sessionResponse.status
);

console.log(
  "Interview Session Response:",
  sessionResponseText
);

if (!sessionResponse.ok) {
  let message =
    "Failed to create interview session";

  try {
    const sessionError =
      JSON.parse(sessionResponseText);

    message =
      sessionError.message || message;
  } catch {
    message =
      sessionResponseText || message;
  }

  throw new Error(message);
}

const sessionData =
  JSON.parse(sessionResponseText);

if (!sessionData.session?._id) {
  throw new Error(
    "Interview session ID was not returned"
  );
}

setSessionId(
  sessionData.session._id
);

        setSuccess(
          "✨ Interview questions generated successfully!"
        );
      } catch (error) {
        console.error(
          "Interview Coach Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to generate interview questions"
        );
      } finally {
        setGenerating(false);
      }
    };

  // =====================================================
  // Evaluate Current Answer
  // =====================================================

  const handleEvaluateAnswer =
    async () => {
      if (questions.length === 0) {
        setError(
          "Please generate interview questions first."
        );
        return;
      }

      const currentQuestion =
        questions[
          currentQuestionIndex
        ];

      if (!currentQuestion) {
        setError(
          "Current question not found."
        );
        return;
      }

      if (!answer.trim()) {
        setError(
          "Please write your answer first."
        );
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const selectedResume =
        resumes.find(
          (resume) =>
            resume._id ===
            selectedResumeId
        );

      if (!selectedResume) {
        setError(
          "Selected resume not found."
        );
        return;
      }

      try {
        setEvaluating(true);
        setError("");
        setSuccess("");
        setFeedback(null);

        const response = await fetch(
          `${API_URL}/api/ai/evaluate-interview`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              question:
                currentQuestion.question,
              answer,
              jobDescription,
              resume: selectedResume,
            }),
          }
        );

        const responseText =
          await response.text();

        console.log(
          "Evaluation Status:",
          response.status
        );

        console.log(
          "Evaluation Response:",
          responseText
        );

        if (!response.ok) {
          let message =
            "Failed to evaluate answer";

          try {
            const data =
              JSON.parse(responseText);

            message =
              data.message ||
              message;
          } catch {
            message =
              responseText ||
              message;
          }

          throw new Error(message);
        }

        const data =
          JSON.parse(responseText);

        if (!data.result) {
          throw new Error(
            "Invalid interview evaluation response"
          );
        }

        setFeedback(data.result);


        if (
  currentQuestionIndex ===
  questions.length - 1 &&
  sessionId
) {
  await fetch(
    `${API_URL}/api/interviews/${sessionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "completed",
      }),
    }
  );
}

        

        // Save answer + AI feedback to MongoDB
if (!sessionId) {
  console.warn(
    "Interview session ID is missing."
  );
} else {
  try {
    const sessionResponse =
      await fetch(
        `${API_URL}/api/interviews/${sessionId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const sessionText =
      await sessionResponse.text();

    if (!sessionResponse.ok) {
      console.warn(
        "Failed to fetch interview session:",
        sessionText
      );
    } else {
      const sessionData =
        JSON.parse(sessionText);

      const existingQuestions =
        sessionData.session?.questions ||
        [];

      const updatedQuestions =
        existingQuestions.map(
          (
            item: InterviewQuestion & {
              answer?: string;
              score?: number;
              feedback?: string;
              strengths?: string[];
              improvements?: string[];
              betterAnswer?: string;
            },
            index: number
          ) => {
            if (
              index !==
              currentQuestionIndex
            ) {
              return item;
            }

            return {
              ...item,
              answer,
              score:
                data.result.score,
              feedback:
                data.result.feedback,
              strengths:
                data.result.strengths ||
                [],
              improvements:
                data.result.improvements ||
                [],
              betterAnswer:
                data.result.betterAnswer ||
                "",
            };
          }
        );

      const updateResponse =
        await fetch(
          `${API_URL}/api/interviews/${sessionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              questions:
                updatedQuestions,
            }),
          }
        );

      const updateText =
        await updateResponse.text();

      if (!updateResponse.ok) {
        console.warn(
          "Failed to save interview answer:",
          updateText
        );
      }
    }
  } catch (saveError) {
    console.error(
      "Save Interview Answer Error:",
      saveError
    );
  }
}

setSuccess(
          "✨ Answer evaluated successfully!"
        );


      } catch (error) {
        console.error(
          "Interview Evaluation Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to evaluate answer"
        );
      } finally {
        setEvaluating(false);
      }
    };

  // =====================================================
  // Next Question
  // =====================================================

  const handleNextQuestion = async () => {
  if (
    currentQuestionIndex <
    questions.length - 1
  ) {
    setCurrentQuestionIndex(
      (prev) => prev + 1
    );

    setAnswer("");
    setFeedback(null);
    setError("");
    setSuccess("");

    return;
  }

  // Last question completed
  if (sessionId) {
    try {
      const response = await fetch(
        `${API_URL}/api/interviews/${sessionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${localStorage.getItem(
                "token"
              )}`,
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "Interview Completion Status:",
        response.status
      );

      console.log(
        "Interview Completion Response:",
        responseText
      );

      if (!response.ok) {
        console.warn(
          "Failed to mark interview as completed:",
          responseText
        );
      }
    } catch (error) {
      console.error(
        "Interview Completion Error:",
        error
      );
    }
  }

  setSuccess(
    "🎉 Interview completed and saved successfully!"
  );
};
  // =====================================================
  // UI
  // =====================================================

  const currentQuestion =
    questions.length > 0
      ? questions[
          currentQuestionIndex
        ]
      : null;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700">
            🎤 AI Powered
          </span>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            AI Interview Coach
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Practice realistic interview
            questions and get AI feedback
            on your answers.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Input Section */}
        {questions.length === 0 && (
          <section className="rounded-2xl bg-white p-6 shadow-lg">

            <h2 className="text-xl font-bold text-slate-900">
              Start Interview Practice
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select your resume and paste
              the target job description.
            </p>

            {/* Resume */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Select Resume
              </label>

              {loadingResumes ? (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                  Loading your resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                  No saved resumes found.
                </div>
              ) : (
                <select
                  value={
                    selectedResumeId
                  }
                  onChange={(e) =>
                    setSelectedResumeId(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-pink-500"
                >
                  <option value="">
                    Select a resume
                  </option>

                  {resumes.map(
                    (resume) => (
                      <option
                        key={resume._id}
                        value={resume._id}
                      >
                        {resume.title ||
                          resume
                            .personalInfo
                            ?.fullName ||
                          "Untitled Resume"}
                      </option>
                    )
                  )}
                </select>
              )}
            </div>

            {/* Job Description */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800">
                  Job Description
                </label>

                <span className="text-xs text-slate-400">
                  {
                    jobDescription.length
                  }{" "}
                  characters
                </span>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(
                    e.target.value
                  )
                }
                placeholder="Paste the job description here..."
                rows={10}
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 p-4 text-sm leading-6 text-slate-900 outline-none focus:border-pink-500"
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={
                handleGenerateQuestions
              }
              disabled={
                generating ||
                loadingResumes ||
                resumes.length === 0
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:from-pink-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating Questions...
                </>
              ) : (
                <>
                  🎤 Generate Interview Questions
                </>
              )}
            </button>

          </section>
        )}

        {/* Interview Practice */}
        {currentQuestion && (
          <section className="mt-8">

            {/* Progress */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-pink-600">
                  Interview Practice
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Question{" "}
                  {currentQuestionIndex +
                    1}{" "}
                  of{" "}
                  {questions.length}
                </h2>
              </div>

              <span className="rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                {currentQuestion.category}
              </span>
            </div>

            {/* Question */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">

              <p className="text-xl font-semibold leading-8 text-slate-900">
                {currentQuestion.question}
              </p>

              {/* Answer */}
              <textarea
                value={answer}
                onChange={(e) =>
                  setAnswer(
                    e.target.value
                  )
                }
                placeholder="Write your answer here..."
                rows={9}
                className="mt-6 w-full resize-y rounded-xl border border-slate-300 p-4 text-slate-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={
                    handleEvaluateAnswer
                  }
                  disabled={evaluating}
                  className="rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {evaluating
                    ? "Evaluating..."
                    : "Submit Answer"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAnswer("");
                    setFeedback(null);
                    setError("");
                    setSuccess("");
                  }}
                  className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Answer
                </button>
              </div>

            </div>

            {/* Feedback */}
            {feedback && (
              <div className="mt-6 space-y-5">

                {/* Score */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Interview Score
                  </p>

                  <div className="mt-2">
                    <span className="text-5xl font-bold text-pink-600">
                      {feedback.score}
                    </span>

                    <span className="ml-1 text-2xl text-slate-400">
                      /10
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-900">
                    AI Feedback
                  </h3>

                  <p className="mt-3 leading-7 text-slate-700">
                    {feedback.feedback}
                  </p>
                </div>

                {/* Strengths */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-green-700">
                    ✅ Strengths
                  </h3>

                  <div className="mt-3 space-y-2">
                    {feedback.strengths.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-green-50 p-3 text-sm text-slate-700"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Improvements */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-orange-700">
                    ⚠️ Areas to Improve
                  </h3>

                  <div className="mt-3 space-y-2">
                    {feedback.improvements.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-orange-50 p-3 text-sm text-slate-700"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Better Answer */}
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-purple-700">
                    💡 Better Answer
                  </h3>

                  <p className="mt-3 whitespace-pre-line rounded-xl bg-purple-50 p-4 text-sm leading-7 text-slate-700">
                    {
                      feedback.betterAnswer
                    }
                  </p>
                </div>

                {/* Next Question */}
                {currentQuestionIndex <
                  questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={
                      handleNextQuestion
                    }
                    className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                  >
                    Next Question →
                  </button>
                ) : (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                    <h3 className="text-xl font-bold text-green-800">
                      🎉 Interview Practice Complete
                    </h3>

                    <p className="mt-2 text-sm text-green-700">
                      You completed all{" "}
                      {questions.length}{" "}
                      interview questions.
                    </p>
                  </div>
                )}

              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}

export default InterviewCoach;