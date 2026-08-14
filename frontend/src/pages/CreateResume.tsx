import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/resumes";

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

function CreateResume() {
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
  const [education, setEducation] = useState<Education[]>([
    {
      degree: "",
      institution: "",
      field: "",
      startYear: "",
      endYear: "",
      grade: "",
    },
  ]);

  // ==============================
  // Experience
  // ==============================
  const [experience, setExperience] = useState<Experience[]>([
    {
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  // ==============================
  // Projects
  // ==============================
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ]);

  // ==============================
  // Certifications
  // ==============================
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      name: "",
      issuer: "",
      year: "",
    },
  ]);

  // ==============================
  // UI State
  // ==============================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==============================
  // Personal Info Handler
  // ==============================
  const handlePersonalInfoChange = (
    field: string,
    value: string
  ) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==============================
  // Skills
  // ==============================
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

  // ==============================
  // Education
  // ==============================
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

  // ==============================
  // Experience
  // ==============================
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

  // ==============================
  // Projects
  // ==============================
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

  // ==============================
  // Certifications
  // ==============================
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

  // ==============================
  // Submit Resume
  // ==============================
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
      setError("Please login before creating a resume.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

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

      const cleanedCertifications = certifications.filter(
        (item) =>
          item.name.trim() ||
          item.issuer.trim()
      );

      const response = await fetch(API_URL, {
        method: "POST",
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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create resume"
        );
      }

      console.log("Resume created:", data);

      setSuccess("Resume created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Create Resume Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create resume"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Input Classes
  // ==============================
  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500";

  const sectionClass =
    "rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            Create Your Resume
          </h1>

          <p className="mt-3 text-slate-400">
            Build your professional resume step by step.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ================================= */}
          {/* Resume Basic Information */}
          {/* ================================= */}
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

          {/* ================================= */}
          {/* Personal Information */}
          {/* ================================= */}
          <section className={sectionClass}>
            <h2 className="mb-6 text-2xl font-semibold">
              Personal Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Vishal Kumar Paswan"
                  value={personalInfo.fullName}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "fullName",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={personalInfo.email}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "email",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Phone
                </label>

                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  value={personalInfo.phone}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "phone",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Location
                </label>

                <input
                  type="text"
                  placeholder="Gorakhpur, Uttar Pradesh"
                  value={personalInfo.location}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "location",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  LinkedIn
                </label>

                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={personalInfo.linkedin}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "linkedin",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  GitHub
                </label>

                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={personalInfo.github}
                  onChange={(e) =>
                    handlePersonalInfoChange(
                      "github",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Portfolio
                </label>

                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
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

          {/* ================================= */}
          {/* Summary */}
          {/* ================================= */}
          <section className={sectionClass}>
            <h2 className="mb-6 text-2xl font-semibold">
              Professional Summary
            </h2>

            <textarea
              rows={5}
              placeholder="Write a short professional summary..."
              value={summary}
              onChange={(e) =>
                setSummary(e.target.value)
              }
              className={inputClass}
            />
          </section>

          {/* ================================= */}
          {/* Skills */}
          {/* ================================= */}
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

          {/* ================================= */}
          {/* Education */}
          {/* ================================= */}
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
              {education.map((item, index) => (
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
              ))}
            </div>
          </section>

          {/* ================================= */}
          {/* Experience */}
          {/* ================================= */}
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
              {experience.map((item, index) => (
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
                        className="text-sm text-red-400"
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
              ))}
            </div>
          </section>

          {/* ================================= */}
          {/* Projects */}
          {/* ================================= */}
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
              {projects.map((project, index) => (
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
                        className="text-sm text-red-400"
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
              ))}
            </div>
          </section>

          {/* ================================= */}
          {/* Certifications */}
          {/* ================================= */}
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
              {certifications.map((item, index) => (
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
                        className="text-sm text-red-400"
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
              ))}
            </div>
          </section>

          {/* ================================= */}
          {/* Messages */}
          {/* ================================= */}
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

          {/* ================================= */}
          {/* Submit */}
          {/* ================================= */}
          <div className="flex justify-end pb-10">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving Resume..."
                : "Save Resume"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

export default CreateResume;