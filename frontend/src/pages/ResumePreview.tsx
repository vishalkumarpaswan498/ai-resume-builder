import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, } from "react-router-dom";
import html2pdf from "html2pdf.js";

const API_URL = `${import.meta.env.VITE_API_URL}/api/resumes`;

type Resume = {
  _id: string;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    field: string;
    startYear: string;
    endYear: string;
    grade: string;
  }[];
  experience: {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
  }[];
};

function ResumePreview() {
 const { id } = useParams();
const navigate = useNavigate();
const [searchParams] = useSearchParams();

const [template, setTemplate] = useState<
  "classic" | "modern" | "executive"
>("classic");

useEffect(() => {
  const selectedTemplate = searchParams.get("template");

  if (
    selectedTemplate === "classic" ||
    selectedTemplate === "modern" ||
    selectedTemplate === "executive"
  ) {
    setTemplate(selectedTemplate);
  }
}, [searchParams]);

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


const handleDownloadPDF = async () => {
  const element = document.getElementById("resume-pdf");

  if (!element) {
    alert("Resume element not found");
    return;
  }

  if (!resume) {
    alert("Resume data not loaded");
    return;
  }

  let container: HTMLDivElement | null = null;

  try {
    console.log(
      `PDF generation started for ${template} template...`
    );

    // ============================================
    // Clone visible resume
    // ============================================

    const clone = element.cloneNode(true) as HTMLElement;

    // ============================================
    // Hidden container
    // ============================================

    container = document.createElement("div");

    container.style.position = "fixed";
    container.style.left = "-100000px";
    container.style.top = "0";
    container.style.width = "794px";
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.backgroundColor = "#ffffff";
    container.style.zIndex = "-99999";
    container.style.pointerEvents = "none";

    document.body.appendChild(container);
    container.appendChild(clone);

    // ============================================
    // Copy computed styles INLINE
    // and remove classes afterwards.
    //
    // This prevents html2canvas from reading
    // Tailwind's oklch stylesheet definitions.
    // ============================================

    const elements = [
      clone,
      ...Array.from(
        clone.querySelectorAll<HTMLElement>("*")
      ),
    ];

    elements.forEach((el) => {
      const originalElements = Array.from(
        element.querySelectorAll<HTMLElement>("*")
      );

      const originalIndex =
        originalElements.indexOf(el);

      // Root uses the root computed style.
      const source =
        originalIndex >= 0
          ? originalElements[originalIndex]
          : element;

      const computed =
        window.getComputedStyle(source);

      // Layout
      el.style.display = computed.display;
      el.style.position = computed.position;
      el.style.width = computed.width;
      el.style.height = computed.height;
      el.style.minWidth = computed.minWidth;
      el.style.minHeight = computed.minHeight;
      el.style.maxWidth = computed.maxWidth;
      el.style.maxHeight = computed.maxHeight;

      el.style.marginTop = computed.marginTop;
      el.style.marginRight = computed.marginRight;
      el.style.marginBottom = computed.marginBottom;
      el.style.marginLeft = computed.marginLeft;

      el.style.paddingTop = computed.paddingTop;
      el.style.paddingRight = computed.paddingRight;
      el.style.paddingBottom = computed.paddingBottom;
      el.style.paddingLeft = computed.paddingLeft;

      el.style.boxSizing = computed.boxSizing;

      // Flex
      el.style.flexDirection = computed.flexDirection;
      el.style.flexWrap = computed.flexWrap;
      el.style.flexGrow = computed.flexGrow;
      el.style.flexShrink = computed.flexShrink;
      el.style.flexBasis = computed.flexBasis;
      el.style.alignItems = computed.alignItems;
      el.style.alignContent = computed.alignContent;
      el.style.alignSelf = computed.alignSelf;
      el.style.justifyContent = computed.justifyContent;
      el.style.gap = computed.gap;
      el.style.rowGap = computed.rowGap;
      el.style.columnGap = computed.columnGap;

      // Grid
      el.style.gridTemplateColumns =
        computed.gridTemplateColumns;
      el.style.gridTemplateRows =
        computed.gridTemplateRows;
      el.style.gridColumnGap =
        computed.gridColumnGap;
      el.style.gridRowGap =
        computed.gridRowGap;

      // Typography
      el.style.fontFamily =
        computed.fontFamily;
      el.style.fontSize =
        computed.fontSize;
      el.style.fontWeight =
        computed.fontWeight;
      el.style.lineHeight =
        computed.lineHeight;
      el.style.letterSpacing =
        computed.letterSpacing;
      el.style.textAlign =
        computed.textAlign;
      el.style.textTransform =
        computed.textTransform;
      el.style.textDecoration =
        computed.textDecoration;
      el.style.whiteSpace =
        computed.whiteSpace;
      el.style.wordBreak =
        computed.wordBreak;
      el.style.overflowWrap =
        computed.overflowWrap;

      // Safe colors
      el.style.color =
        computed.color || "#111827";

      el.style.backgroundColor =
        computed.backgroundColor || "transparent";

      el.style.borderTopColor =
        computed.borderTopColor || "transparent";

      el.style.borderRightColor =
        computed.borderRightColor || "transparent";

      el.style.borderBottomColor =
        computed.borderBottomColor || "transparent";

      el.style.borderLeftColor =
        computed.borderLeftColor || "transparent";

      // Borders
      el.style.borderTopWidth =
        computed.borderTopWidth;
      el.style.borderRightWidth =
        computed.borderRightWidth;
      el.style.borderBottomWidth =
        computed.borderBottomWidth;
      el.style.borderLeftWidth =
        computed.borderLeftWidth;

      el.style.borderTopStyle =
        computed.borderTopStyle;
      el.style.borderRightStyle =
        computed.borderRightStyle;
      el.style.borderBottomStyle =
        computed.borderBottomStyle;
      el.style.borderLeftStyle =
        computed.borderLeftStyle;

      // Radius
      el.style.borderRadius =
        computed.borderRadius;

      // Overflow
      el.style.overflow =
        computed.overflow;
      el.style.overflowX =
        computed.overflowX;
      el.style.overflowY =
        computed.overflowY;

      // Text spacing
      el.style.wordSpacing =
        computed.wordSpacing;

      // Remove classes so Tailwind CSS is no longer used
      el.removeAttribute("class");
    });

    // ============================================
    // Root sizing
    // ============================================

    clone.style.width = "794px";
    clone.style.minHeight = "1123px";
    clone.style.margin = "0";
    clone.style.backgroundColor = "#ffffff";

    // ============================================
    // Generate PDF
    // ============================================

    const options = {
      margin: 0,

      filename: `${
        resume.personalInfo.fullName || "Resume"
      }-${template}.pdf`,

      image: {
        type: "jpeg" as const,
        quality: 0.98,
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
      },

      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    await html2pdf()
      .set(options)
      .from(clone)
      .save();

    console.log(
      `${template} PDF downloaded successfully`
    );

    alert(
      `${
        template.charAt(0).toUpperCase() +
        template.slice(1)
      } template PDF downloaded successfully!`
    );
  } catch (error) {
    console.error(
      "Template PDF Download Error:",
      error
    );

    alert(
      `PDF download failed: ${
        error instanceof Error
          ? error.message
          : "Unknown error"
      }`
    );
  } finally {
    // VERY IMPORTANT:
    // Always remove hidden clone.
    if (
      container &&
      document.body.contains(container)
    ) {
      document.body.removeChild(container);
    }

    console.log("PDF cleanup completed");
  }
};






  useEffect(() => {
    const fetchResume = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load resume");
        }

        setResume(data.resume);
      } catch (error) {
        console.error("Resume Preview Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load resume"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-center text-white">
        Loading resume...
      </main>
    );
  }

  if (error || !resume) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-center text-white">
        <p className="text-red-400">
          {error || "Resume not found"}
        </p>

        <button
          onClick={() => navigate("/my-resumes")}
          className="mt-5 rounded-lg bg-blue-600 px-5 py-2"
        >
          Back to My Resumes
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-200 px-4 py-10">
      <div className="mx-auto max-w-4xl">

      {/* Template Selector */}
<div className="mb-6 rounded-2xl bg-white p-4 shadow-lg">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>
      <h2 className="text-lg font-bold text-slate-900">
        Resume Template
      </h2>

      <p className="text-sm text-slate-500">
        Choose a professional style for your resume.
      </p>
    </div>

    <div className="flex flex-wrap gap-2">

      <button
        type="button"
        onClick={() => {
          setTemplate("classic");
          navigate(`/resume/${id}?template=classic`);
        }}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          template === "classic"
            ? "bg-blue-600 text-white"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        Classic
      </button>

      <button
        type="button"
        onClick={() => {
          setTemplate("modern");
          navigate(`/resume/${id}?template=modern`);
        }}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          template === "modern"
            ? "bg-blue-600 text-white"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        Modern
      </button>

      <button
        type="button"
        onClick={() => {
          setTemplate("executive");
          navigate(`/resume/${id}?template=executive`);
        }}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
          template === "executive"
            ? "bg-blue-600 text-white"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        Executive
      </button>

    </div>
  </div>
</div>

        {/* Top Buttons */}
        <div className="mb-6 flex justify-between">
          <button
            onClick={() => navigate("/my-resumes")}
            className="rounded-lg bg-slate-800 px-5 py-2 text-white hover:bg-slate-700"
          >
            ← Back
          </button>

          <button
            onClick={handleDownloadPDF}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500"
            >
            Download PDF
        </button>
        </div>

        {/* Resume */}
<div
  id="resume-pdf"
  className="resume-pdf min-h-[1123px] bg-white"
>
  {/* =========================================================
      CLASSIC TEMPLATE
  ========================================================= */}
  {template === "classic" && (
    <div className="min-h-[1123px] bg-white p-8 text-gray-900 md:p-12">

      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-5 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {resume.personalInfo.fullName}
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          {resume.personalInfo.email}

          {resume.personalInfo.phone &&
            ` | ${resume.personalInfo.phone}`}

          {resume.personalInfo.location &&
            ` | ${resume.personalInfo.location}`}
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-blue-600">
          {resume.personalInfo.linkedin && (
            <a
              href={resume.personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}

          {resume.personalInfo.github && (
            <a
              href={resume.personalInfo.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}

          {resume.personalInfo.portfolio && (
            <a
              href={resume.personalInfo.portfolio}
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {resume.summary && (
        <section className="mt-6">
          <h2 className="border-b border-gray-300 pb-2 text-sm font-bold tracking-widest text-gray-900">
            PROFESSIONAL SUMMARY
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-700">
            {resume.summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <section className="mt-6">
          <h2 className="border-b border-gray-300 pb-2 text-sm font-bold tracking-widest">
            SKILLS
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={index}
                className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <section className="mt-6">
          <h2 className="border-b border-gray-300 pb-2 text-sm font-bold tracking-widest">
            EDUCATION
          </h2>

          <div className="mt-4 space-y-5">
            {resume.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {edu.degree}
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      {edu.institution}
                    </p>

                    {edu.field && (
                      <p className="text-sm text-gray-600">
                        {edu.field}
                      </p>
                    )}

                    {edu.grade && (
                      <p className="text-sm text-gray-600">
                        Grade: {edu.grade}
                      </p>
                    )}
                  </div>

                  <span className="whitespace-nowrap text-sm text-gray-500">
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <section className="mt-6">
          <h2 className="border-b border-gray-300 pb-2 text-sm font-bold tracking-widest">
            WORK EXPERIENCE
          </h2>

          <div className="mt-4 space-y-6">
            {resume.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold">
                      {exp.jobTitle}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {exp.company}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>

                {exp.description && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <section className="mt-6">
          <h2 className="border-b border-gray-300 pb-2 text-sm font-bold tracking-widest">
            PROJECTS
          </h2>

          <div className="mt-4 space-y-5">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-bold">
                  {project.name}
                </h3>

                {project.technologies?.length > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">
                      Technologies:
                    </span>{" "}
                    {project.technologies.join(", ")}
                  </p>
                )}

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {project.description}
                </p>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm text-blue-600"
                  >
                    Project Link
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <section className="mt-6">
          <h2 className="border-b border-gray-300 pb-2 text-sm font-bold tracking-widest">
            CERTIFICATIONS
          </h2>

          <div className="mt-4 space-y-3">
            {resume.certifications.map((certificate, index) => (
              <div
                key={index}
                className="flex justify-between gap-4 text-sm"
              >
                <div>
                  <span className="font-semibold">
                    {certificate.name}
                  </span>

                  {certificate.issuer && (
                    <span className="text-gray-600">
                      {" "}
                      — {certificate.issuer}
                    </span>
                  )}
                </div>

                <span className="whitespace-nowrap text-gray-500">
                  {certificate.year}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )}

  {/* =========================================================
      MODERN TEMPLATE
  ========================================================= */}
  {template === "modern" && (
    <div className="grid min-h-[1123px] grid-cols-1 bg-white text-slate-900 md:grid-cols-[240px_1fr]">

      {/* Sidebar */}
      <aside className="bg-slate-900 p-7 text-white">

        <h1 className="text-3xl font-bold leading-tight">
          {resume.personalInfo.fullName}
        </h1>

        <p className="mt-2 text-sm text-blue-300">
          Resume
        </p>

        {/* Contact */}
        <div className="mt-8">
          <h2 className="border-b border-slate-700 pb-2 text-xs font-bold uppercase tracking-widest text-blue-300">
            CONTACT
          </h2>

          <div className="mt-4 space-y-3 text-sm text-slate-300">

            {resume.personalInfo.email && (
              <p className="break-words">
                {resume.personalInfo.email}
              </p>
            )}

            {resume.personalInfo.phone && (
              <p>
                {resume.personalInfo.phone}
              </p>
            )}

            {resume.personalInfo.location && (
              <p>
                {resume.personalInfo.location}
              </p>
            )}

          </div>
        </div>

        {/* Links */}
        {(resume.personalInfo.linkedin ||
          resume.personalInfo.github ||
          resume.personalInfo.portfolio) && (
          <div className="mt-8">

            <h2 className="border-b border-slate-700 pb-2 text-xs font-bold uppercase tracking-widest text-blue-300">
              LINKS
            </h2>

            <div className="mt-4 space-y-2 text-sm">

              {resume.personalInfo.linkedin && (
                <a
                  href={resume.personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-300 hover:text-white"
                >
                  LinkedIn
                </a>
              )}

              {resume.personalInfo.github && (
                <a
                  href={resume.personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-300 hover:text-white"
                >
                  GitHub
                </a>
              )}

              {resume.personalInfo.portfolio && (
                <a
                  href={resume.personalInfo.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-300 hover:text-white"
                >
                  Portfolio
                </a>
              )}

            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills?.length > 0 && (
          <div className="mt-8">

            <h2 className="border-b border-slate-700 pb-2 text-xs font-bold uppercase tracking-widest text-blue-300">
              SKILLS
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>

          </div>
        )}

        {/* Education in sidebar */}
        {resume.education?.length > 0 && (
          <div className="mt-8">

            <h2 className="border-b border-slate-700 pb-2 text-xs font-bold uppercase tracking-widest text-blue-300">
              EDUCATION
            </h2>

            <div className="mt-4 space-y-5">

              {resume.education.map((edu, index) => (
                <div key={index}>

                  <h3 className="text-sm font-semibold text-white">
                    {edu.degree}
                  </h3>

                  <p className="mt-1 text-xs text-slate-300">
                    {edu.institution}
                  </p>

                  {edu.endYear && (
                    <p className="mt-1 text-xs text-slate-500">
                      {edu.startYear} - {edu.endYear}
                    </p>
                  )}

                </div>
              ))}

            </div>
          </div>
        )}

      </aside>

      {/* Main content */}
      <div className="p-8 md:p-10">

        {/* Summary */}
        {resume.summary && (
          <section>

            <h2 className="border-l-4 border-blue-600 pl-3 text-sm font-bold uppercase tracking-widest text-slate-900">
              PROFESSIONAL SUMMARY
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-700">
              {resume.summary}
            </p>

          </section>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <section className="mt-7">

            <h2 className="border-l-4 border-blue-600 pl-3 text-sm font-bold uppercase tracking-widest">
              WORK EXPERIENCE
            </h2>

            <div className="mt-4 space-y-6">

              {resume.experience.map((exp, index) => (
                <div key={index}>

                  <div className="flex justify-between gap-4">

                    <div>
                      <h3 className="font-bold">
                        {exp.jobTitle}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-blue-700">
                        {exp.company}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-xs text-slate-500">
                      {exp.startDate} - {exp.endDate}
                    </span>

                  </div>

                  {exp.description && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                      {exp.description}
                    </p>
                  )}

                </div>
              ))}

            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <section className="mt-7">

            <h2 className="border-l-4 border-blue-600 pl-3 text-sm font-bold uppercase tracking-widest">
              PROJECTS
            </h2>

            <div className="mt-4 space-y-5">

              {resume.projects.map((project, index) => (
                <div key={index}>

                  <h3 className="font-bold">
                    {project.name}
                  </h3>

                  {project.technologies?.length > 0 && (
                    <p className="mt-1 text-xs font-medium text-blue-700">
                      {project.technologies.join(" • ")}
                    </p>
                  )}

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {project.description}
                  </p>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-sm text-blue-600"
                    >
                      View Project
                    </a>
                  )}

                </div>
              ))}

            </div>
          </section>
        )}

        {/* Certifications */}
        {resume.certifications?.length > 0 && (
          <section className="mt-7">

            <h2 className="border-l-4 border-blue-600 pl-3 text-sm font-bold uppercase tracking-widest">
              CERTIFICATIONS
            </h2>

            <div className="mt-4 space-y-3">

              {resume.certifications.map((certificate, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-4 text-sm"
                >

                  <div>
                    <span className="font-semibold">
                      {certificate.name}
                    </span>

                    {certificate.issuer && (
                      <span className="text-slate-600">
                        {" "}
                        — {certificate.issuer}
                      </span>
                    )}
                  </div>

                  <span className="whitespace-nowrap text-xs text-slate-500">
                    {certificate.year}
                  </span>

                </div>
              ))}

            </div>
          </section>
        )}

      </div>
    </div>
  )}

  {/* =========================================================
      EXECUTIVE TEMPLATE
  ========================================================= */}
  {template === "executive" && (
    <div className="min-h-[1123px] bg-stone-50 p-8 text-stone-900 md:p-12">

      {/* Executive Header */}
      <header className="border-b-4 border-stone-900 pb-7">

        <h1 className="text-5xl font-bold tracking-tight">
          {resume.personalInfo.fullName}
        </h1>

        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-stone-600">
          Professional Resume
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">

          {resume.personalInfo.email && (
            <span>
              {resume.personalInfo.email}
            </span>
          )}

          {resume.personalInfo.phone && (
            <span>
              {resume.personalInfo.phone}
            </span>
          )}

          {resume.personalInfo.location && (
            <span>
              {resume.personalInfo.location}
            </span>
          )}

        </div>

        <div className="mt-2 flex flex-wrap gap-5 text-sm text-stone-600">

          {resume.personalInfo.linkedin && (
            <a
              href={resume.personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          )}

          {resume.personalInfo.github && (
            <a
              href={resume.personalInfo.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}

          {resume.personalInfo.portfolio && (
            <a
              href={resume.personalInfo.portfolio}
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          )}

        </div>

      </header>

      {/* Summary */}
      {resume.summary && (
        <section className="mt-7">

          <h2 className="border-b-2 border-stone-400 pb-2 text-sm font-bold uppercase tracking-[0.18em]">
            PROFESSIONAL SUMMARY
          </h2>

          <p className="mt-3 text-sm leading-7 text-stone-700">
            {resume.summary}
          </p>

        </section>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <section className="mt-7">

          <h2 className="border-b-2 border-stone-400 pb-2 text-sm font-bold uppercase tracking-[0.18em]">
            PROFESSIONAL EXPERIENCE
          </h2>

          <div className="mt-5 space-y-7">

            {resume.experience.map((exp, index) => (
              <div key={index}>

                <div className="flex justify-between gap-5">

                  <div>

                    <h3 className="text-lg font-bold">
                      {exp.jobTitle}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-stone-700">
                      {exp.company}
                    </p>

                  </div>

                  <span className="whitespace-nowrap text-sm text-stone-500">
                    {exp.startDate} - {exp.endDate}
                  </span>

                </div>

                {exp.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">
                    {exp.description}
                  </p>
                )}

              </div>
            ))}

          </div>
        </section>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <section className="mt-7">

          <h2 className="border-b-2 border-stone-400 pb-2 text-sm font-bold uppercase tracking-[0.18em]">
            SELECTED PROJECTS
          </h2>

          <div className="mt-5 grid gap-6 md:grid-cols-2">

            {resume.projects.map((project, index) => (
              <div
                key={index}
                className="border-l-2 border-stone-300 pl-4"
              >

                <h3 className="font-bold">
                  {project.name}
                </h3>

                {project.technologies?.length > 0 && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {project.technologies.join(" • ")}
                  </p>
                )}

                <p className="mt-2 text-sm leading-6 text-stone-700">
                  {project.description}
                </p>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-stone-800 underline"
                  >
                    Project Link
                  </a>
                )}

              </div>
            ))}

          </div>
        </section>
      )}

      {/* Education */}
      {resume.education?.length > 0 && (
        <section className="mt-7">

          <h2 className="border-b-2 border-stone-400 pb-2 text-sm font-bold uppercase tracking-[0.18em]">
            EDUCATION
          </h2>

          <div className="mt-5 space-y-4">

            {resume.education.map((edu, index) => (
              <div
                key={index}
                className="flex justify-between gap-5"
              >

                <div>

                  <h3 className="font-bold">
                    {edu.degree}
                  </h3>

                  <p className="mt-1 text-sm text-stone-700">
                    {edu.institution}
                  </p>

                  {edu.field && (
                    <p className="text-sm text-stone-500">
                      {edu.field}
                    </p>
                  )}

                  {edu.grade && (
                    <p className="text-sm text-stone-500">
                      Grade: {edu.grade}
                    </p>
                  )}

                </div>

                <span className="whitespace-nowrap text-sm text-stone-500">
                  {edu.startYear} - {edu.endYear}
                </span>

              </div>
            ))}

          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills?.length > 0 && (
        <section className="mt-7">

          <h2 className="border-b-2 border-stone-400 pb-2 text-sm font-bold uppercase tracking-[0.18em]">
            CORE SKILLS
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3">

            {resume.skills.map((skill, index) => (
              <div
                key={index}
                className="border-b border-stone-200 pb-2 text-sm text-stone-700"
              >
                {skill}
              </div>
            ))}

          </div>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications?.length > 0 && (
        <section className="mt-7">

          <h2 className="border-b-2 border-stone-400 pb-2 text-sm font-bold uppercase tracking-[0.18em]">
            CERTIFICATIONS
          </h2>

          <div className="mt-4 space-y-3">

            {resume.certifications.map(
              (certificate, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-5 text-sm"
                >

                  <div>
                    <span className="font-semibold">
                      {certificate.name}
                    </span>

                    {certificate.issuer && (
                      <span className="text-stone-600">
                        {" "}
                        — {certificate.issuer}
                      </span>
                    )}
                  </div>

                  <span className="whitespace-nowrap text-stone-500">
                    {certificate.year}
                  </span>

                </div>
              )
            )}

          </div>
        </section>
      )}

    </div>
  )}
</div>
      </div>
    </main>
  );
}

export default ResumePreview;