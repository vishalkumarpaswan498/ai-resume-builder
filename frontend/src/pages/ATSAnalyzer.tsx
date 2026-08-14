import { useState } from "react";

function ATSAnalyzer() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const [analysis, setAnalysis] = useState({
    keywords: 0,
    formatting: 0,
    skills: 0,
    experience: 0,
  });

  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    setResumeFile(file);
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste the job description.");
      return;
    }

    setLoading(true);

    // Temporary frontend calculation.
    // Later we will connect this with your backend + AI.
    setTimeout(() => {
      const calculatedScore = 82;

      setScore(calculatedScore);

      setAnalysis({
        keywords: 88,
        formatting: 90,
        skills: 78,
        experience: 80,
      });

      setMissingKeywords([
        "React",
        "REST API",
        "Docker",
        "TypeScript",
      ]);

      setSuggestions([
        "Add more job-specific keywords to your resume.",
        "Add measurable achievements to your experience section.",
        "Mention React and TypeScript if you have relevant experience.",
        "Add projects that match the job description.",
        "Keep your resume concise and ATS-friendly.",
      ]);

      setLoading(false);
    }, 1500);
  };

  const getScoreColor = () => {
    if (score === null) return "text-gray-900";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            ATS Resume Analyzer
          </h1>

          <p className="mt-2 text-slate-600">
            Check how well your resume matches a job description.
          </p>
        </div>

        {/* Upload + Job Description */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Resume Upload */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-slate-900">
              Upload Resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload your resume in PDF or DOCX format.
            </p>

            <label
              htmlFor="resume-upload"
              className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-blue-500 hover:bg-blue-50"
            >
              <div className="text-4xl">📄</div>

              <p className="mt-3 font-semibold text-slate-700">
                {resumeFile
                  ? resumeFile.name
                  : "Click to upload your resume"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                PDF or DOCX
              </p>

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {resumeFile && (
              <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                ✓ Resume uploaded successfully
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-slate-900">
              Job Description
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Paste the job description you want to apply for.
            </p>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="mt-5 h-64 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-2 text-right text-xs text-slate-400">
              {jobDescription.length} characters
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing Resume..." : "Check ATS Score"}
          </button>
        </div>

        {/* Results */}
        {score !== null && !loading && (
          <div className="mt-10">

            {/* Score */}
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">

              <h2 className="text-xl font-bold text-slate-900">
                Your ATS Score
              </h2>

              <div className={`mt-4 text-6xl font-bold ${getScoreColor()}`}>
                {score}
                <span className="text-2xl text-slate-400">
                  /100
                </span>
              </div>

              <div className="mx-auto mt-6 h-4 max-w-xl overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>

              <p className="mt-4 text-slate-600">
                Your resume has a good ATS compatibility score.
              </p>
            </div>

            {/* Analysis Cards */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl bg-white p-6 shadow-md">
                <p className="text-sm text-slate-500">
                  Keyword Match
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {analysis.keywords}%
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-md">
                <p className="text-sm text-slate-500">
                  Formatting
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {analysis.formatting}%
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-md">
                <p className="text-sm text-slate-500">
                  Skills Match
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {analysis.skills}%
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-md">
                <p className="text-sm text-slate-500">
                  Experience Match
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-600">
                  {analysis.experience}%
                </p>
              </div>

            </div>

            {/* Missing Keywords + Suggestions */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* Missing Keywords */}
              <div className="rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-xl font-bold text-slate-900">
                  Missing Keywords
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Consider adding these keywords if they are relevant
                  to your actual experience.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

              </div>

              {/* Suggestions */}
              <div className="rounded-2xl bg-white p-6 shadow-md">

                <h2 className="text-xl font-bold text-slate-900">
                  Improvement Suggestions
                </h2>

                <div className="mt-5 space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-lg bg-slate-50 p-3"
                    >
                      <span className="text-green-600">
                        ✓
                      </span>

                      <p className="text-sm text-slate-700">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* Improve Resume */}
            <div className="mt-6 rounded-2xl bg-slate-900 p-8 text-center text-white">

              <h2 className="text-2xl font-bold">
                Want to improve your resume?
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-slate-300">
                Use AI-powered suggestions to make your resume
                stronger and more job-specific.
              </p>

              <button
                className="mt-5 rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500"
                onClick={() =>
                  alert("AI Resume Improvement coming next!")
                }
              >
                Improve My Resume
              </button>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default ATSAnalyzer;