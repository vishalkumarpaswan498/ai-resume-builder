import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type InterviewSession = {
  _id: string;
  resumeId?: {
    title?: string;
    personalInfo?: {
      fullName?: string;
    };
  };
  jobDescription: string;
  totalQuestions: number;
  completedQuestions: number;
  averageScore: number;
  status: "in-progress" | "completed";
  createdAt: string;
  completedAt?: string | null;
};

function InterviewHistory() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<
    InterviewSession[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interviews`,
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
            "Failed to load interview history"
        );
      }

      setSessions(data.sessions || []);
    } catch (error) {
      console.error(
        "Interview History Error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load interview history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this interview session?"
      );

    if (!confirmed) return;

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interviews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete interview session"
        );
      }

      setSessions((prev) =>
        prev.filter(
          (session) =>
            session._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Interview Session Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete interview session"
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-slate-500">
            Loading interview history...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
              🎤 Interview History
            </span>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Your Interview Sessions
            </h1>

            <p className="mt-2 text-slate-600">
              Review your previous interview attempts,
              scores and progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/interview-coach")
            }
            className="rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-500"
          >
            Start New Interview
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {sessions.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-4xl">
              🎤
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No interview sessions yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Complete your first AI interview practice
              session and your results will appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/interview-coach")
              }
              className="mt-6 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-500"
            >
              Start Interview Practice
            </button>

          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {sessions.map((session) => {

              const resumeName =
                session.resumeId?.title ||
                session.resumeId?.personalInfo
                  ?.fullName ||
                "Resume";

              const score =
                session.averageScore || 0;

              return (
                <div
                  key={session._id}
                  className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h2 className="truncate text-lg font-bold text-slate-900">
                        {resumeName}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          session.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        session.status ===
                        "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {session.status ===
                      "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>

                  </div>

                  {/* Score */}
                  <div className="mt-6 rounded-xl bg-slate-50 p-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Average Score
                    </p>

                    <div className="mt-1">

                      <span className="text-4xl font-bold text-pink-600">
                        {score.toFixed(1)}
                      </span>

                      <span className="ml-1 text-lg text-slate-400">
                        /10
                      </span>

                    </div>

                  </div>

                  {/* Progress */}
                  <div className="mt-5">

                    <div className="flex justify-between text-sm">

                      <span className="text-slate-500">
                        Questions Completed
                      </span>

                      <span className="font-semibold text-slate-700">
                        {
                          session.completedQuestions
                        }{" "}
                        /{" "}
                        {
                          session.totalQuestions
                        }
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className="h-full rounded-full bg-pink-500"
                        style={{
                          width: `${
                            session.totalQuestions >
                            0
                              ? Math.min(
                                  100,
                                  (session.completedQuestions /
                                    session.totalQuestions) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Job */}
                  <div className="mt-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Target Job
                    </p>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">
                      {session.jobDescription}
                    </p>

                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/interview-history/${session._id}`
                        )
                      }
                      className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          session._id
                        )
                      }
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}

export default InterviewHistory;