import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/resumes`;

type Resume = {
  _id: string;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
  };
};

type ATSResult = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  keywords: string[];
  suggestions: string[];
};

function ATSScore() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [result, setResult] = useState<ATSResult | null>(null);

  const [error, setError] = useState("");

  // ==============================
  // FETCH USER RESUMES
  // ==============================

  useEffect(() => {
    const fetchResumes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load resumes");
        }

        setResumes(data.resumes || []);
      } catch (error) {
        console.error("Fetch Resumes Error:", error);

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
  }, [navigate]);

  // ==============================
  // ANALYZE RESUME
  // ==============================

  const handleAnalyze = async () => {
    if (!selectedResume) {
      alert("Please select a resume");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste the Job Description");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      /*
       * TEMPORARY RESULT
       *
       * Next step me isi jagah backend
       * ATS API connect karenge.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      setResult({
        score: 82,

        matchedSkills: [
          "JavaScript",
          "React",
          "Node.js",
          "MongoDB",
          "HTML",
          "CSS",
        ],

        missingSkills: [
          "TypeScript",
          "Docker",
          "AWS",
        ],

        keywords: [
          "React",
          "Node.js",
          "REST API",
          "MongoDB",
          "Git",
        ],

        suggestions: [
          "Add TypeScript to your skills if you have experience with it.",
          "Mention REST API development in your projects.",
          "Add measurable achievements to your project descriptions.",
          "Mention Git/GitHub experience.",
        ],
      });
    } catch (error) {
      console.error("ATS Analysis Error:", error);

      alert("ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // SCORE COLOR
  // ==============================

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";

    if (score >= 60) return "text-yellow-500";

    return "text-red-500";
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              ATS Resume Analyzer
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Check how well your resume matches a job description.
            </p>
          </div>

          <button
            onClick={() => navigate("/my-resumes")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← My Resumes
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}


        <div className="grid gap-6 lg:grid-cols-2">


          {/* ================= LEFT ================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              1. Select Resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose the resume you want to analyze.
            </p>


            <div className="mt-5">

              {loadingResumes ? (
                <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500">
                  Loading your resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">

                  <p className="font-medium text-yellow-800">
                    No resumes found.
                  </p>

                  <button
                    onClick={() => navigate("/create-resume")}
                    className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Create Resume
                  </button>

                </div>
              ) : (
                <select
                  value={selectedResume}
                  onChange={(e) =>
                    setSelectedResume(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    Select a resume
                  </option>

                  {resumes.map((resume) => (
                    <option
                      key={resume._id}
                      value={resume._id}
                    >
                      {resume.title ||
                        resume.personalInfo.fullName ||
                        "Untitled Resume"}
                    </option>
                  ))}

                </select>
              )}

            </div>


            {/* ================= JOB DESCRIPTION ================= */}

            <div className="mt-8">

              <h2 className="text-lg font-bold text-slate-900">
                2. Job Description
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Paste the job description from the company.
              </p>

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder="Paste the complete job description here..."
                className="mt-4 min-h-[300px] w-full resize-y rounded-lg border border-slate-300 p-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="mt-2 text-right text-xs text-slate-400">
                {jobDescription.length} characters
              </div>

            </div>


            {/* ================= ANALYZE BUTTON ================= */}

            <button
              onClick={handleAnalyze}
              disabled={
                loading ||
                !selectedResume ||
                !jobDescription.trim()
              }
              className="mt-5 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Analyzing Resume..."
                : "Analyze Resume"}

            </button>

          </div>


          {/* ================= RIGHT ================= */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              ATS Analysis
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your resume analysis will appear here.
            </p>


            {!result ? (

              <div className="mt-10 flex min-h-[500px] flex-col items-center justify-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
                  📄
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-800">
                  Ready to analyze your resume
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Select your resume, paste the job description,
                  and click Analyze Resume to get your ATS score.
                </p>

              </div>

            ) : (

              <div className="mt-6 space-y-6">

                {/* ================= SCORE ================= */}

                <div className="rounded-xl border border-slate-200 p-6 text-center">

                  <p className="text-sm font-medium text-slate-500">
                    ATS MATCH SCORE
                  </p>

                  <div
                    className={`mt-3 text-7xl font-bold ${getScoreColor(
                      result.score
                    )}`}
                  >
                    {result.score}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    out of 100
                  </p>

                  <div className="mx-auto mt-5 h-3 max-w-md overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${result.score}%`,
                      }}
                    />

                  </div>

                </div>


                {/* ================= MATCHED ================= */}

                <div>

                  <h3 className="font-semibold text-green-700">
                    ✓ Matched Skills
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {result.matchedSkills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-green-50 px-3 py-1.5 text-sm text-green-700"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>


                {/* ================= MISSING ================= */}

                <div>

                  <h3 className="font-semibold text-red-700">
                    ✗ Missing Skills
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {result.missingSkills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-700"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>


                {/* ================= KEYWORDS ================= */}

                <div>

                  <h3 className="font-semibold text-blue-700">
                    Important Keywords
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {result.keywords.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                        >
                          {keyword}
                        </span>
                      )
                    )}

                  </div>

                </div>


                {/* ================= SUGGESTIONS ================= */}

                <div>

                  <h3 className="font-semibold text-slate-800">
                    💡 Improvement Suggestions
                  </h3>

                  <div className="mt-3 space-y-3">

                    {result.suggestions.map(
                      (suggestion, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700"
                        >
                          {index + 1}. {suggestion}
                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}

export default ATSScore;