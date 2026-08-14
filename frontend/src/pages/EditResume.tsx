import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/resumes`;

type Education = {
  degree: string;
  institution: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
};

type Experience = {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Project = {
  name: string;
  description: string;
  technologies: string;
  link: string;
};

type Certification = {
  name: string;
  issuer: string;
  year: string;
};

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
  education: Education[];
  experience: Experience[];

  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];

  certifications: Certification[];
};

function EditResume() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==============================
  // Basic Information
  // ==============================

  const [title, setTitle] = useState("");

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [summary, setSummary] = useState("");

  // ==============================
  // Skills
  // ==============================

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // ==============================
  // Education
  // ==============================

  const [education, setEducation] = useState<Education[]>([]);

  // ==============================
  // Experience
  // ==============================

  const [experience, setExperience] = useState<Experience[]>([]);

  // ==============================
  // Projects
  // ==============================

  const [projects, setProjects] = useState<Project[]>([]);

  // ==============================
  // Certifications
  // ==============================

  const [certifications, setCertifications] = useState<
    Certification[]
  >([]);

  // ==============================
  // UI State
  // ==============================

 const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

// AI state

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [aiLoading, setAiLoading] = useState(false);
const [jobDescription, setJobDescription] = useState("");

const [aiProjectSuggestions, setAiProjectSuggestions] =
  useState<Project[]>([]);

const [aiExperienceSuggestions, setAiExperienceSuggestions] =
  useState<string[]>([]);
  // ==================================================
  // Fetch Existing Resume
  // ==================================================

  useEffect(() => {
    const fetchResume = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        setError("Resume ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch resume"
          );
        }

        const resume: Resume = data.resume;

        // Basic information
        setTitle(resume.title || "");

        // Personal information
        setPersonalInfo({
          fullName: resume.personalInfo?.fullName || "",
          email: resume.personalInfo?.email || "",
          phone: resume.personalInfo?.phone || "",
          location: resume.personalInfo?.location || "",
          linkedin: resume.personalInfo?.linkedin || "",
          github: resume.personalInfo?.github || "",
          portfolio: resume.personalInfo?.portfolio || "",
        });

        // Summary
        setSummary(resume.summary || "");

        // Skills
        setSkills(resume.skills || []);

        // Education
        setEducation(
          resume.education?.length
            ? resume.education
            : [
                {
                  degree: "",
                  institution: "",
                  field: "",
                  startYear: "",
                  endYear: "",
                  grade: "",
                },
              ]
        );

        // Experience
        setExperience(
          resume.experience?.length
            ? resume.experience
            : [
                {
                  jobTitle: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                },
              ]
        );

        // Projects
        setProjects(
          resume.projects?.length
            ? resume.projects.map((project) => ({
                name: project.name || "",
                description: project.description || "",
                technologies: Array.isArray(project.technologies)
                  ? project.technologies.join(", ")
                  : "",
                link: project.link || "",
              }))
            : [
                {
                  name: "",
                  description: "",
                  technologies: "",
                  link: "",
                },
              ]
        );

        // Certifications
        setCertifications(
          resume.certifications?.length
            ? resume.certifications
            : [
                {
                  name: "",
                  issuer: "",
                  year: "",
                },
              ]
        );
      } catch (error) {
        console.error("Fetch Resume Error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch resume"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, navigate]);

  // ==================================================
  // Personal Information
  // ==================================================

  const handlePersonalInfoChange = (
    field: string,
    value: string
  ) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==================================================
  // Skills
  // ==================================================

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }

    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  // ==================================================
  // Education
  // ==================================================

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        degree: "",
        institution: "",
        field: "",
        startYear: "",
        endYear: "",
        grade: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setEducation((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // ==================================================
  // Experience
  // ==================================================

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperience((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperience((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // ==================================================
  // Projects
  // ==================================================

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleProjectChange = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    setProjects((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  

  // ==================================================
  // Certifications
  // ==================================================

  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      {
        name: "",
        issuer: "",
        year: "",
      },
    ]);
  };

  const removeCertification = (index: number) => {
    setCertifications((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleCertificationChange = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    setCertifications((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // ==================================================
// Generate Summary with AI
// ==================================================

// ==================================================
// Generate Resume Content with AI
// ==================================================

const handleGenerateAI = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  if (!jobDescription.trim()) {
    setError("Please enter a target job description first.");
    return;
  }

  try {
    setAiLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ai/generate-resume`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobDescription,
          skills,
          projects,
          experience,
        }),
      }
    );

    const responseText = await response.text();

    console.log("AI Status:", response.status);
    console.log("AI Response:", responseText);

    if (!response.ok) {
      let message = "AI generation failed";

      try {
        const data = JSON.parse(responseText);
        message = data.message || message;
      } catch {
        message = responseText || message;
      }

      throw new Error(message);
    }

    const data = JSON.parse(responseText);

    if (!data.result) {
      throw new Error("Invalid AI response");
    }

    const result = data.result;

    // AI summary
    if (result.summary) {
      setSummary(result.summary);
    }

    // AI skills
    if (
      Array.isArray(result.skills) &&
      result.skills.length > 0
    ) {
      setSkills(result.skills);
    }

    // AI project suggestions
    if (
      Array.isArray(result.projectSuggestions) &&
      result.projectSuggestions.length > 0
    ) {
      const aiProjects: Project[] =
        result.projectSuggestions.map(
          (project: {
            name?: string;
            description?: string;
            technologies?: string[];
          }) => ({
            name: project.name || "",
            description: project.description || "",
            technologies: Array.isArray(
              project.technologies
            )
              ? project.technologies.join(", ")
              : "",
            link: "",
          })
        );

        // AI experience suggestions
if (
  Array.isArray(result.experienceSuggestions) &&
  result.experienceSuggestions.length > 0
) {
  setAiExperienceSuggestions(
    result.experienceSuggestions
  );
}

      setAiProjectSuggestions(aiProjects);
    }

    setSuccess(
      "✨ AI suggestions generated. Review them below and apply the ones you want."
    );
  } catch (error) {
    console.error("AI Resume Error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to generate AI content"
    );
  } finally {
    setAiLoading(false);
  }
};

  // ==================================================
  // Submit / Update Resume
  // ==================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a resume title.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!id) {
      setError("Resume ID is missing.");
      return;
    }

    try {
      setSaving(true);

      // Convert technologies string → array
      const formattedProjects = projects
        .filter(
          (project) =>
            project.name.trim() ||
            project.description.trim()
        )
        .map((project) => ({
          name: project.name,
          description: project.description,

          technologies: project.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter(Boolean),

          link: project.link,
        }));

      // Remove completely empty entries
      const cleanedEducation = education.filter(
        (item) =>
          item.degree.trim() ||
          item.institution.trim()
      );

      const cleanedExperience = experience.filter(
        (item) =>
          item.jobTitle.trim() ||
          item.company.trim()
      );

      const cleanedCertifications =
        certifications.filter(
          (item) =>
            item.name.trim() ||
            item.issuer.trim()
        );

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            personalInfo,
            summary,
            skills,
            education: cleanedEducation,
            experience: cleanedExperience,
            projects: formattedProjects,
            certifications: cleanedCertifications,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update resume"
        );
      }

      console.log("Resume updated:", data);

      setSuccess(
        "Resume updated successfully!"
      );

      setTimeout(() => {
        navigate("/my-resumes");
      }, 1200);
    } catch (error) {
      console.error(
        "Update Resume Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update resume"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // Classes
  // ==================================================

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500";

  const sectionClass =
    "rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl";

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-slate-400">
            Loading resume...
          </p>
        </div>
      </main>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            Edit Your Resume
          </h1>

          <p className="mt-3 text-slate-400">
            Update your resume information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ==================================================
              Resume Information
          ================================================== */}

          <section className={sectionClass}>
            <h2 className="mb-6 text-2xl font-semibold">
              Resume Information
            </h2>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Resume Title
            </label>

            <input
              type="text"
              placeholder="e.g. Software Developer Resume"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className={inputClass}
            />
          </section>

          {/* ==================================================
              Personal Information
          ================================================== */}

          <section className={sectionClass}>
            <h2 className="mb-6 text-2xl font-semibold">
              Personal Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <input
                type="text"
                placeholder="Full Name"
                value={personalInfo.fullName}
                onChange={(e) =>
                  handlePersonalInfoChange(
                    "fullName",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                type="email"
                placeholder="Email"
                value={personalInfo.email}
                onChange={(e) =>
                  handlePersonalInfoChange(
                    "email",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                type="text"
                placeholder="Phone"
                value={personalInfo.phone}
                onChange={(e) =>
                  handlePersonalInfoChange(
                    "phone",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                type="text"
                placeholder="Location"
                value={personalInfo.location}
                onChange={(e) =>
                  handlePersonalInfoChange(
                    "location",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                type="url"
                placeholder="LinkedIn"
                value={personalInfo.linkedin}
                onChange={(e) =>
                  handlePersonalInfoChange(
                    "linkedin",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <input
                type="url"
                placeholder="GitHub"
                value={personalInfo.github}
                onChange={(e) =>
                  handlePersonalInfoChange(
                    "github",
                    e.target.value
                  )
                }
                className={inputClass}
              />

              <div className="md:col-span-2">
                <input
                  type="url"
                  placeholder="Portfolio"
                  value={personalInfo.portfolio}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "portfolio",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

            </div>
          </section>

          {/* ==================================================
              Summary
          ================================================== */}

         {/* ==================================================
    Professional Summary
================================================== */}

<section className={sectionClass}>

  {/* Header */}
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h2 className="text-2xl font-semibold text-white">
        Professional Summary
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Create a strong ATS-friendly summary for your resume.
      </p>
    </div>

    {/* AI Button */}
    <button
      type="button"
      onClick={handleGenerateAI}
      disabled={aiLoading}
      className="
        group inline-flex items-center justify-center gap-2
        rounded-xl
        bg-gradient-to-r from-purple-600 to-blue-600
        px-5 py-3
        font-semibold text-white
        shadow-lg shadow-purple-900/20
        transition-all duration-200
        hover:-translate-y-0.5
        hover:from-purple-500
        hover:to-blue-500
        hover:shadow-xl
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:translate-y-0
      "
    >
      {aiLoading ? (
        <>
          <span
            className="
              h-5 w-5
              animate-spin
              rounded-full
              border-2
              border-white/30
              border-t-white
            "
          />

          <span>Generating...</span>
        </>
      ) : (
        <>
          <span className="text-lg transition-transform group-hover:scale-110">
            ✨
          </span>

          <span>Generate with AI</span>
        </>
      )}
    </button>
  </div>

  {/* Target Job Description */}
  <div className="mb-6">

    <label className="mb-2 block text-sm font-medium text-slate-300">
      Target Job Description
    </label>

    <textarea
      rows={6}
      value={jobDescription}
      onChange={(e) =>
        setJobDescription(e.target.value)
      }
      placeholder="Paste the job description for the position you are applying for..."
      className={`
        ${inputClass}
        min-h-[150px]
        resize-y
        leading-7
      `}
    />

    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
      <span>
        AI will tailor your resume to this job description.
      </span>

      <span>
        {jobDescription.length} characters
      </span>
    </div>
  </div>

  {/* Summary Editor */}
  <div className="relative">

    <label className="mb-2 block text-sm font-medium text-slate-300">
      Professional Summary
    </label>

    <textarea
      rows={7}
      placeholder="Write your professional summary here, or let AI create one based on your resume and target job..."
      value={summary}
      onChange={(e) =>
        setSummary(e.target.value)
      }
      className={`
        ${inputClass}
        min-h-[180px]
        resize-y
        leading-7
        transition-all
        focus:ring-2
        focus:ring-blue-500/20
      `}
    />

    {/* Character information */}
    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
      <span>
        Keep your summary concise and achievement-focused.
      </span>

      <span>
        {summary.length} characters
      </span>
    </div>

  </div>

  {/* AI Information */}
  <div
    className="
      mt-5
      flex gap-3
      rounded-xl
      border border-purple-500/20
      bg-purple-500/5
      p-4
    "
  >

    <div
      className="
        flex h-9 w-9 shrink-0
        items-center justify-center
        rounded-lg
        bg-purple-500/10
        text-lg
      "
    >
      ✨
    </div>

    <div>
      <p className="font-medium text-purple-300">
        AI-powered resume optimization
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-400">
        AI analyzes your target job description, skills,
        education, experience and projects to generate
        professional ATS-friendly resume content.
      </p>
    </div>

  </div>

</section>


{/* ==================================================
    AI Suggestions
================================================== */}

{(aiProjectSuggestions.length > 0 ||
  aiExperienceSuggestions.length > 0) && (
  <section className={sectionClass}>

    <div className="mb-6">
      <h2 className="text-2xl font-semibold">
        ✨ AI Suggestions
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Review AI-generated suggestions and apply only
        the changes you want.
      </p>
    </div>

    {/* Experience Suggestions */}
    {aiExperienceSuggestions.length > 0 && (
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-lg font-semibold text-white">
              Experience Suggestions
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              AI-generated professional bullet points.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setExperience((prev) => {
                if (prev.length === 0) {
                  return [
                    {
                      jobTitle: "",
                      company: "",
                      startDate: "",
                      endDate: "",
                      description:
                        aiExperienceSuggestions.join(
                          "\n"
                        ),
                    },
                  ];
                }

                return prev.map((item, index) =>
                  index === 0
                    ? {
                        ...item,
                        description:
                          aiExperienceSuggestions.join(
                            "\n"
                          ),
                      }
                    : item
                );
              });

              setAiExperienceSuggestions([]);

              setSuccess(
                "✨ Experience suggestions applied."
              );
            }}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
          >
            Apply Experience
          </button>

        </div>

        <div className="mt-4 space-y-3">
          {aiExperienceSuggestions.map(
            (suggestion, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-300"
              >
                <span className="mr-2 font-semibold text-purple-400">
                  {index + 1}.
                </span>

                {suggestion}
              </div>
            )
          )}
        </div>

      </div>
    )}

    {/* Project Suggestions */}
    {aiProjectSuggestions.length > 0 && (
      <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-lg font-semibold text-white">
              Project Suggestions
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              AI-improved project descriptions and technologies.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setProjects((prev) => {
                if (prev.length === 0) {
                  return aiProjectSuggestions;
                }

                return prev.map((project, index) => ({
                  ...project,

                  description:
                    aiProjectSuggestions[index]
                      ?.description ||
                    project.description,

                  technologies:
                    aiProjectSuggestions[index]
                      ?.technologies ||
                    project.technologies,

                  name:
                    project.name.trim()
                      ? project.name
                      : aiProjectSuggestions[index]
                          ?.name || "",

                  link: project.link,
                }));
              });

              setAiProjectSuggestions([]);

              setSuccess(
                "✨ Project suggestions applied."
              );
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Apply Projects
          </button>

        </div>

        <div className="mt-4 space-y-4">

          {aiProjectSuggestions.map(
            (project, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-950 p-5"
              >

                <h4 className="text-lg font-semibold text-white">
                  {project.name}
                </h4>

                {project.technologies && (
                  <p className="mt-2 text-sm text-blue-400">
                    {project.technologies}
                  </p>
                )}

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {project.description}
                </p>

              </div>
            )
          )}

        </div>

      </div>
    )}

  </section>
)}



          {/* ==================================================
              Skills
          ================================================== */}

          <section className={sectionClass}>
            <h2 className="mb-6 text-2xl font-semibold">
              Skills
            </h2>

            <div className="flex gap-3">

              <input
                type="text"
                placeholder="e.g. Java"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className={inputClass}
              />

              <button
                type="button"
                onClick={addSkill}
                className="rounded-lg bg-blue-600 px-5 font-semibold hover:bg-blue-500"
              >
                Add
              </button>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 rounded-full bg-blue-600/20 px-4 py-2 text-sm text-blue-300"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(skill)
                    }
                    className="font-bold text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}

            </div>
          </section>

          {/* ==================================================
              Education
          ================================================== */}

          <section className={sectionClass}>

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-semibold">
                Education
              </h2>

              <button
                type="button"
                onClick={addEducation}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
              >
                + Add Education
              </button>

            </div>

            <div className="space-y-6">

              {education.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 p-5"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="font-semibold">
                        Education #{index + 1}
                      </h3>

                      {education.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeEducation(index)
                          }
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                      <input
                        placeholder="Degree"
                        value={item.degree}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "degree",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Institution"
                        value={item.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Field of Study"
                        value={item.field}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "field",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Grade / CGPA"
                        value={item.grade}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "grade",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Start Year"
                        value={item.startYear}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "startYear",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="End Year"
                        value={item.endYear}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            "endYear",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                    </div>

                  </div>
                )
              )}

            </div>
          </section>

          {/* ==================================================
              Experience
          ================================================== */}

          <section className={sectionClass}>

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-semibold">
                Work Experience
              </h2>

              <button
                type="button"
                onClick={addExperience}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
              >
                + Add Experience
              </button>

            </div>

            <div className="space-y-6">

              {experience.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 p-5"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="font-semibold">
                        Experience #{index + 1}
                      </h3>

                      {experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeExperience(index)
                          }
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                      <input
                        placeholder="Job Title"
                        value={item.jobTitle}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "jobTitle",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Company"
                        value={item.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Start Date"
                        value={item.startDate}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="End Date"
                        value={item.endDate}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                    </div>

                    <textarea
                      rows={4}
                      placeholder="Describe your responsibilities and achievements..."
                      value={item.description}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className={`${inputClass} mt-5`}
                    />

                  </div>
                )
              )}

            </div>
          </section>

          {/* ==================================================
              Projects
          ================================================== */}

          <section className={sectionClass}>

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-semibold">
                Projects
              </h2>

              <button
                type="button"
                onClick={addProject}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
              >
                + Add Project
              </button>

            </div>

            <div className="space-y-6">

              {projects.map(
                (project, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 p-5"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="font-semibold">
                        Project #{index + 1}
                      </h3>

                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeProject(index)
                          }
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="space-y-5">

                      <input
                        placeholder="Project Name"
                        value={project.name}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <textarea
                        rows={4}
                        placeholder="Describe your project..."
                        value={project.description}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Technologies (comma separated) e.g. React, Node.js, MongoDB"
                        value={project.technologies}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "technologies",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        type="url"
                        placeholder="Project Link"
                        value={project.link}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "link",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                    </div>

                  </div>
                )
              )}

            </div>
          </section>

          {/* ==================================================
              Certifications
          ================================================== */}

          <section className={sectionClass}>

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-semibold">
                Certifications
              </h2>

              <button
                type="button"
                onClick={addCertification}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
              >
                + Add Certification
              </button>

            </div>

            <div className="space-y-6">

              {certifications.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 p-5"
                  >

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="font-semibold">
                        Certification #{index + 1}
                      </h3>

                      {certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeCertification(index)
                          }
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid gap-5 md:grid-cols-3">

                      <input
                        placeholder="Certification Name"
                        value={item.name}
                        onChange={(e) =>
                          handleCertificationChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Issuing Organization"
                        value={item.issuer}
                        onChange={(e) =>
                          handleCertificationChange(
                            index,
                            "issuer",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                      <input
                        placeholder="Year"
                        value={item.year}
                        onChange={(e) =>
                          handleCertificationChange(
                            index,
                            "year",
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />

                    </div>

                  </div>
                )
              )}

            </div>
          </section>

          {/* ==================================================
              Messages
          ================================================== */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              {success}
            </div>
          )}

          {/* ==================================================
              Buttons
          ================================================== */}

          <div className="flex justify-end gap-4 pb-10">

            <button
              type="button"
              onClick={() =>
                navigate("/my-resumes")
              }
              className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Updating Resume..."
                : "Update Resume"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}

export default EditResume;