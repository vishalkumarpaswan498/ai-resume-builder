import { useEffect, useState } from "react";

type ATSResult = {
  atsScore: number;

  analysis: {
    keywords: number;
    formatting: number;
    skills: number;
    experience: number;
  };

  matchedKeywords: string[];
  missingKeywords: string[];
  detectedSkills: string[];
  suggestions: string[];

  resumeTextLength: number;
};

type SavedResume = {
  _id: string;
  title: string;

  personalInfo?: {
    fullName?: string;
  };
};

function ATSChecker() {
  const [resumeFile, setResumeFile] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] =
    useState<ATSResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [savedResumes, setSavedResumes] =
    useState<SavedResume[]>([]);

  const [selectedResumeId, setSelectedResumeId] =
    useState("");

  const [loadingResumes, setLoadingResumes] =
    useState(true);

  const [analyzeMode, setAnalyzeMode] =
    useState<"saved" | "upload">("saved");

  // =====================================================
  // Fetch Saved Resumes
  // =====================================================

  useEffect(() => {
    const fetchSavedResumes = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoadingResumes(false);
        return;
      }

      try {
       const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/resumes`,
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

        setSavedResumes(
          data.resumes || []
        );

        if (
          data.resumes &&
          data.resumes.length > 0
        ) {
          setSelectedResumeId(
            data.resumes[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Fetch Resumes Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load saved resumes"
        );
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchSavedResumes();
  }, []);

  // =====================================================
  // Analyze Resume
  // =====================================================

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError(
        "Please enter the job description."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    if (
      analyzeMode === "saved" &&
      !selectedResumeId
    ) {
      setError(
        "Please select a saved resume."
      );
      return;
    }

    if (
      analyzeMode === "upload" &&
      !resumeFile
    ) {
      setError(
        "Please upload your resume."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      let response: Response;

      // ================================================
      // Saved Resume
      // ================================================

      if (
        analyzeMode === "saved"
      ) {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ats/analyze-saved/${selectedResumeId}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              jobDescription,
            }),
          }
        );
      }

      // ================================================
      // Uploaded Resume
      // ================================================

      else {
        if (!resumeFile) {
          throw new Error(
            "Please upload a resume."
          );
        }

        const formData =
          new FormData();

        formData.append(
          "resume",
          resumeFile
        );

        formData.append(
          "jobDescription",
          jobDescription
        );

        response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ats/analyze`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );
      }

      const responseText =
        await response.text();

      console.log(
        "ATS Status:",
        response.status
      );

      console.log(
        "ATS Response:",
        responseText
      );

      if (!response.ok) {
        let message =
          "ATS analysis failed";

        try {
          const errorData =
            JSON.parse(responseText);

          message =
            errorData.message ||
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
          "Invalid ATS response from server"
        );
      }

      setResult(data.result);
    } catch (error) {
      console.error(
        "ATS Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "ATS analysis failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-slate-900">
            ATS Resume Compatibility Checker
          </h1>

          <p className="mt-2 text-slate-600">
            Compare your resume with a job
            description and estimate its ATS
            compatibility.
          </p>

        </div>

        {/* Input Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">

          {/* Resume Source */}
          <div>

            <label className="mb-3 block font-semibold text-slate-800">
              Choose Resume
            </label>

            {/* Mode Switch */}
            <div className="mb-5 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => {
                  setAnalyzeMode("saved");
                  setError("");
                  setResult(null);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  analyzeMode === "saved"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Use Saved Resume
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnalyzeMode("upload");
                  setError("");
                  setResult(null);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  analyzeMode === "upload"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Upload New Resume
              </button>

            </div>

            {/* Saved Resume */}
            {analyzeMode === "saved" && (
              <>
                {loadingResumes ? (
                  <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    Loading your saved resumes...
                  </div>
                ) : savedResumes.length ===
                  0 ? (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">

                    <p className="text-sm text-yellow-800">
                      No saved resumes found.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setAnalyzeMode(
                          "upload"
                        );
                        setError("");
                      }}
                      className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      Upload Resume Instead
                    </button>

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
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select a saved resume
                    </option>

                    {savedResumes.map(
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
              </>
            )}

            {/* Upload New Resume */}
            {analyzeMode === "upload" && (
              <>

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (!file) {
                      setResumeFile(null);
                      return;
                    }

                    const allowedTypes = [
                      "application/pdf",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ];

                    if (
                      !allowedTypes.includes(
                        file.type
                      )
                    ) {
                      setResumeFile(null);

                      setError(
                        "Only PDF and DOCX files are supported."
                      );

                      return;
                    }

                    if (
                      file.size >
                      5 * 1024 * 1024
                    ) {
                      setResumeFile(null);

                      setError(
                        "Resume file must be smaller than 5MB."
                      );

                      return;
                    }

                    setError("");
                    setResumeFile(file);
                  }}
                  className="w-full rounded-lg border border-slate-300 p-3"
                />

                <p className="mt-1 text-sm text-slate-500">
                  PDF or DOCX — maximum 5MB
                </p>

                {resumeFile && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {resumeFile.name}
                  </p>
                )}

              </>
            )}

          </div>

          {/* Job Description */}
          <div className="mt-6">

            <div className="flex items-center justify-between">

              <label className="font-semibold text-slate-800">
                Job Description
              </label>

              <span className="text-xs text-slate-400">
                {jobDescription.length} characters
              </span>

            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(
                  e.target.value
                );

                if (error) {
                  setError("");
                }
              }}
              placeholder="Paste the complete job description here..."
              rows={10}
              className="mt-2 w-full rounded-lg border border-slate-300 p-4 outline-none focus:border-blue-500"
            />

          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">
              {error}
            </p>
          )}

          {/* Analyze Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={
              loading ||
              loadingResumes ||
              !jobDescription.trim() ||
              (analyzeMode === "saved"
                ? !selectedResumeId
                : !resumeFile)
            }
            className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading
              ? "Analyzing Resume..."
              : "Check ATS Score"}
          </button>

        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* Overall Score */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">

              <div className="flex flex-col items-center text-center">

                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Estimated ATS Compatibility
                </p>

                {/* Quick Stats */}
                <div className="mt-6 grid w-full gap-4 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Keyword Match
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {
                        result.analysis
                          .keywords
                      }%
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Skills Match
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {
                        result.analysis
                          .skills
                      }%
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resume Length
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {
                        result.resumeTextLength
                      }

                      <span className="ml-1 text-sm font-medium text-slate-400">
                        chars
                      </span>
                    </p>
                  </div>

                </div>

                {/* Score Circle */}
                <div className="mt-8 flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-blue-100">

                  <div>
                    <div className="text-5xl font-bold text-blue-600">
                      {
                        result.atsScore
                      }
                    </div>

                    <div className="text-sm text-slate-400">
                      out of 100
                    </div>
                  </div>

                </div>

                {/* Score Message */}
                <p className="mt-5 text-slate-600">
                  {result.atsScore >=
                  80
                    ? "Excellent ATS compatibility"
                    : result.atsScore >=
                      60
                    ? "Good, but there is room for improvement"
                    : "Your resume needs significant improvement"}
                </p>

                {/* Score Bar */}
                <div className="mt-5 h-3 w-full max-w-xl overflow-hidden rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          result.atsScore
                        )
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* Analysis */}
            <div className="grid gap-4 md:grid-cols-4">

              <ScoreCard
                title="Keywords"
                score={
                  result.analysis.keywords
                }
              />

              <ScoreCard
                title="Formatting"
                score={
                  result.analysis.formatting
                }
              />

              <ScoreCard
                title="Skills"
                score={
                  result.analysis.skills
                }
              />

              <ScoreCard
                title="Experience"
                score={
                  result.analysis.experience
                }
              />

            </div>

            {/* Matched Keywords */}
            <KeywordCard
              title="Matched Keywords"
              keywords={
                result.matchedKeywords
              }
            />

            {/* Missing Keywords */}
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">

              <h2 className="text-xl font-bold text-red-800">
                Priority Keywords
              </h2>

              <p className="mt-1 text-sm text-red-700">
                Add these only when they accurately
                describe your real skills or experience.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                {result.missingKeywords
                  .length > 0 ? (
                  result.missingKeywords.map(
                    (
                      keyword,
                      index
                    ) => (
                      <span
                        key={index}
                        className="rounded-full bg-white px-3 py-1 text-sm font-medium text-red-700"
                      >
                        {keyword}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm font-medium text-green-700">
                    Great! No important missing
                    keywords were found.
                  </p>
                )}

              </div>

            </div>

            {/* Detected Skills */}
            <KeywordCard
              title="Detected Skills"
              keywords={
                result.detectedSkills
              }
            />

            {/* Suggestions */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">

              <h2 className="text-xl font-bold text-slate-900">
                Resume Improvement Suggestions
              </h2>

              {result.suggestions.length >
              0 ? (
                <ul className="mt-4 space-y-3">

                  {result.suggestions.map(
                    (
                      suggestion,
                      index
                    ) => (
                      <li
                        key={index}
                        className="rounded-lg bg-slate-50 p-3 text-slate-700"
                      >
                        💡 {suggestion}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p className="mt-4 text-slate-500">
                  No additional suggestions.
                </p>
              )}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}

// =====================================================
// Score Card
// =====================================================

function ScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  const label =
    score >= 80
      ? "Excellent"
      : score >= 60
      ? "Good"
      : "Needs Work";

  return (
    <div className="rounded-xl bg-white p-5 shadow">

      <div className="flex items-center justify-between gap-2">

        <p className="text-sm font-semibold text-slate-600">
          {title}
        </p>

        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            score >= 80
              ? "bg-green-100 text-green-700"
              : score >= 60
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {label}
        </span>

      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {score}

        <span className="text-sm text-slate-400">
          /100
        </span>
      </p>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

        <div
          className={`h-full rounded-full transition-all ${
            score >= 80
              ? "bg-green-500"
              : score >= 60
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{
            width: `${Math.max(
              0,
              Math.min(100, score)
            )}%`,
          }}
        />

      </div>

    </div>
  );
}

// =====================================================
// Keyword Card
// =====================================================

function KeywordCard({
  title,
  keywords,
}: {
  title: string;
  keywords: string[];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">

      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">

        {keywords.length > 0 ? (
          keywords.map(
            (keyword, index) => (
              <span
                key={index}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                {keyword}
              </span>
            )
          )
        ) : (
          <p className="text-slate-500">
            No keywords found.
          </p>
        )}

      </div>

    </div>
  );
}

export default ATSChecker;