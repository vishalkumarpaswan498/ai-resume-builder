import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/api/resumes`;

type Resume = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResumes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch resumes");
      }

      setResumes(data.resumes || []);
    } catch (error) {
      console.error("Fetch Resumes Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch resumes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete resume");
      }

      setResumes((prev) =>
        prev.filter((resume) => resume._id !== id)
      );
    } catch (error) {
      console.error("Delete Resume Error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete resume"
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-slate-400">
            Loading your resumes...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold">
              My Resumes
            </h1>

            <p className="mt-2 text-slate-400">
              Manage all your resumes from one place.
            </p>
          </div>

          <Link
            to="/create-resume"
            className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold transition hover:bg-blue-500"
          >
            + Create New Resume
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Count */}
        <div className="mb-6">
          <p className="text-slate-400">
            Total Resumes:{" "}
            <span className="font-semibold text-white">
              {resumes.length}
            </span>
          </p>
        </div>

        {/* No Resume */}
        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <h2 className="text-2xl font-semibold">
              No resumes yet
            </h2>

            <p className="mt-3 text-slate-400">
              Create your first professional resume.
            </p>

            <Link
              to="/create-resume"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              Create My Resume
            </Link>
          </div>
        ) : (
          /* Resume Cards */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition hover:border-slate-700"
              >
                {/* Resume Icon */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-2xl">
                  📄
                </div>

                {/* Title */}
                <h2 className="truncate text-xl font-semibold">
                  {resume.title}
                </h2>

                {/* Date */}
                <p className="mt-2 text-sm text-slate-500">
                  Created on{" "}
                  {new Date(
                    resume.createdAt
                  ).toLocaleDateString()}
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">

                  {/* View */}
                  <button
                    onClick={() =>
                      navigate(`/resume/${resume._id}`)
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    View
                  </button>

                  {/* Choose Template */}
{/* Choose Template */}
<button
  onClick={() =>
    navigate(`/resume/${resume._id}?template=classic`)
  }
  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold transition hover:bg-purple-500"
>
  🎨 Template
</button>

                  {/* Edit */}
                  <button
                    onClick={() =>
                      navigate(`/edit-resume/${resume._id}`)
                    }
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      handleDelete(resume._id)
                    }
                    className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyResumes;