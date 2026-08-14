import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";

type SavedResume = {
  _id: string;
  title: string;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  skills?: string[];
  education?: unknown[];
  experience?: unknown[];
  projects?: unknown[];
  certifications?: unknown[];
};

function CoverLetter() {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // Fetch Saved Resumes
  // ========================================

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
            data.message || "Failed to load resumes"
          );
        }

        const resumeList = data.resumes || [];

        setResumes(resumeList);

        if (resumeList.length > 0) {
          setSelectedResumeId(resumeList[0]._id);
        }
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
  }, []);

  // ========================================
  // Generate Cover Letter
  // ========================================

  const handleGenerate = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const selectedResume = resumes.find(
      (resume) => resume._id === selectedResumeId
    );

    if (!selectedResume) {
      setError("Selected resume not found.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");
      setCoverLetter("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-cover-letter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobDescription,
            resume: selectedResume,
          }),
        }
      );

      const responseText = await response.text();

      console.log(
        "Cover Letter Status:",
        response.status
      );

      console.log(
        "Cover Letter Response:",
        responseText
      );

      if (!response.ok) {
        let message = "Failed to generate cover letter";

        try {
          const data = JSON.parse(responseText);
          message = data.message || message;
        } catch {
          message = responseText || message;
        }

        throw new Error(message);
      }

      const data = JSON.parse(responseText);

      if (!data.coverLetter) {
        throw new Error(
          "AI did not return a cover letter."
        );
      }

      setCoverLetter(data.coverLetter);

      setSuccess(
        "✨ Cover letter generated successfully!"
      );
    } catch (error) {
      console.error(
        "Cover Letter Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate cover letter"
      );
    } finally {
      setGenerating(false);
    }
  };

  // ========================================
  // Copy Cover Letter
  // ========================================

  const handleCopy = async () => {
    if (!coverLetter) return;

    try {
      await navigator.clipboard.writeText(
        coverLetter
      );

      setSuccess(
        "Cover letter copied to clipboard!"
      );

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Copy Error:", error);

      setError("Failed to copy cover letter.");
    }
  };

  // ========================================
  // Download TXT
  // ========================================

  const handleDownload = () => {
    if (!coverLetter) {
      setError("Generate a cover letter first.");
      return;
    }

    const blob = new Blob(
      [coverLetter],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "cover-letter.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  // ========================================
// Download Cover Letter as PDF
// ========================================

const handleDownloadPDF = async () => {
  if (!coverLetter) {
    setError("Generate a cover letter first.");
    return;
  }

  let container: HTMLDivElement | null = null;

  try {
    const fullName =
      selectedResumeId
        ? resumes.find(
            (resume) =>
              resume._id === selectedResumeId
          )?.personalInfo?.fullName
        : "Candidate";

    // Temporary PDF container
    container = document.createElement("div");

    container.style.position = "fixed";
    container.style.left = "-100000px";
    container.style.top = "0";
    container.style.width = "794px";
    container.style.backgroundColor = "#ffffff";
    container.style.padding = "0";
    container.style.margin = "0";
    container.style.zIndex = "-9999";

    // Professional cover letter layout
    const pdfContent =
      document.createElement("div");

    pdfContent.style.width = "794px";
    pdfContent.style.minHeight = "1123px";
    pdfContent.style.boxSizing = "border-box";
    pdfContent.style.padding = "70px 75px";
    pdfContent.style.backgroundColor =
      "#ffffff";
    pdfContent.style.color = "#111827";
    pdfContent.style.fontFamily =
      "Arial, Helvetica, sans-serif";
    pdfContent.style.fontSize = "14px";
    pdfContent.style.lineHeight = "1.8";

    // Header
    const header =
      document.createElement("div");

    header.style.borderBottom =
      "2px solid #1e293b";
    header.style.paddingBottom = "18px";
    header.style.marginBottom = "32px";

    const name =
      document.createElement("h1");

    name.textContent =
      fullName || "Cover Letter";

    name.style.margin = "0";
    name.style.fontSize = "28px";
    name.style.fontWeight = "700";
    name.style.color = "#0f172a";

    header.appendChild(name);

    // Date
    const date =
      document.createElement("p");

    date.textContent =
      new Date().toLocaleDateString(
        "en-IN",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

    date.style.margin =
      "8px 0 0 0";
    date.style.fontSize = "13px";
    date.style.color = "#64748b";

    header.appendChild(date);

    pdfContent.appendChild(header);

    // Cover letter body
    const body =
      document.createElement("div");

    body.style.whiteSpace =
      "pre-wrap";
    body.style.wordBreak =
      "break-word";
    body.style.color = "#334155";

    // Split paragraphs
    const paragraphs =
      coverLetter
        .split(/\n\s*\n/)
        .filter(
          (paragraph) =>
            paragraph.trim()
        );

    paragraphs.forEach(
      (paragraph) => {
        const p =
          document.createElement("p");

        p.textContent =
          paragraph.trim();

        p.style.margin =
          "0 0 20px 0";

        p.style.lineHeight =
          "1.8";

        body.appendChild(p);
      }
    );

    pdfContent.appendChild(body);

    // Footer
    const footer =
      document.createElement("div");

    footer.style.marginTop =
      "50px";
    footer.style.paddingTop =
      "18px";
    footer.style.borderTop =
      "1px solid #e2e8f0";
    footer.style.fontSize =
      "11px";
    footer.style.color =
      "#94a3b8";
    footer.textContent =
      "Generated with AI Resume Builder";

    pdfContent.appendChild(
      footer
    );

    container.appendChild(
      pdfContent
    );

    document.body.appendChild(
      container
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    const options = {
      margin: 0,

      filename: `${(
        fullName ||
        "Cover-Letter"
      ).replace(
        /\s+/g,
        "-"
      )}-Cover-Letter.pdf`,

      image: {
        type: "jpeg" as const,
        quality: 0.98,
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor:
          "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation:
          "portrait" as const,
      },

      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    await html2pdf()
      .set(options)
      .from(pdfContent)
      .save();

    setSuccess(
      "📄 Cover letter PDF downloaded successfully!"
    );
  } catch (error) {
    console.error(
      "Cover Letter PDF Error:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Failed to download cover letter PDF"
    );
  } finally {
    if (
      container &&
      document.body.contains(
        container
      )
    ) {
      document.body.removeChild(
        container
      );
    }
  }
};






  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* ========================================
            Header
        ======================================== */}

        <div className="mb-8">
          <div>
            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              ✨ AI Powered
            </span>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              AI Cover Letter Generator
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Create a professional, job-specific cover
              letter using your saved resume and the job
              description.
            </p>
          </div>
        </div>

        {/* ========================================
            Error / Success
        ======================================== */}

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

        {/* ========================================
            Main Grid
        ======================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ======================================
              LEFT: INPUT
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-lg">

            <h2 className="text-xl font-bold text-slate-900">
              Create Your Cover Letter
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select your resume and paste the target
              job description.
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
                  No saved resumes found. Create a resume
                  first.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) =>
                    setSelectedResumeId(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                        resume.personalInfo?.fullName ||
                        "Untitled Resume"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Job Description */}
            <div className="mt-6">

              <div className="flex items-center justify-between">

                <label className="block text-sm font-semibold text-slate-800">
                  Job Description
                </label>

                <span className="text-xs text-slate-400">
                  {jobDescription.length} characters
                </span>

              </div>

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(
                    e.target.value
                  )
                }
                placeholder="Paste the complete job description here..."
                rows={14}
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 p-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Generate */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                generating ||
                loadingResumes ||
                resumes.length === 0
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  ✨ Generate Cover Letter
                </>
              )}
            </button>

          </section>

          {/* ======================================
              RIGHT: RESULT
          ====================================== */}

          <section className="rounded-2xl bg-white p-6 shadow-lg">

            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Your Cover Letter
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your AI-generated cover letter will
                  appear here.
                </p>
              </div>

              {coverLetter && (
  <div className="flex flex-wrap gap-2">

    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      Copy
    </button>

    <button
      type="button"
      onClick={handleDownload}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
    >
      TXT
    </button>

    <button
      type="button"
      onClick={handleDownloadPDF}
      className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-500"
    >
      📄 Download PDF
    </button>

  </div>
)}

            </div>

            {!coverLetter ? (
              <div className="flex min-h-[550px] flex-col items-center justify-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 text-4xl">
                  ✉️
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-800">
                  Ready to write
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Select a resume, paste the job description,
                  and let AI create a tailored cover letter.
                </p>

              </div>
            ) : (
              <textarea
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
                className="mt-6 min-h-[550px] w-full resize-y rounded-xl border border-slate-300 p-5 text-sm leading-7 text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            )}

          </section>

        </div>

      </div>
    </main>
  );
}

export default CoverLetter;