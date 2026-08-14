import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type InterviewQuestion = {
  question: string;
  category:
    | "HR"
    | "Technical"
    | "Project"
    | "Behavioral";
  answer?: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  betterAnswer?: string;
};

type InterviewSession = {
  _id: string;
  jobDescription: string;
  totalQuestions: number;
  completedQuestions: number;
  averageScore: number;
  status: "in-progress" | "completed";
  createdAt: string;
  completedAt?: string | null;
  resumeId?: {
    title?: string;
    personalInfo?: {
      fullName?: string;
    };
  };
  questions: InterviewQuestion[];
};

function InterviewHistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] =
    useState<InterviewSession | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        setError(
          "Interview session ID is missing."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/interviews/${id}`,
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
              "Failed to load interview session"
          );
        }

        setSession(data.session);
      } catch (error) {
        console.error(
          "Interview History Detail Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load interview session"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-slate-500">
            Loading interview session...
          </p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <div className="rounded-2xl bg-white p-10 shadow-lg">
            <p className="text-red-600">
              {error ||
                "Interview session not found"}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/interview-history")
              }
              className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Back to Interview History
            </button>
          </div>
        </div>
      </main>
    );
  }

  const resumeName =
    session.resumeId?.title ||
    session.resumeId?.personalInfo?.fullName ||
    "Resume";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate("/interview-history")
          }
          className="mb-6 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Back to History
        </button>

        {/* Header */}
        <section className="rounded-2xl bg-white p-6 shadow-lg">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
                🎤 Interview Session
              </span>

              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                {resumeName}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Started on{" "}
                {new Date(
                  session.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                session.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {session.status === "completed"
                ? "Completed"
                : "In Progress"}
            </span>

          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Average Score
              </p>

              <p className="mt-2 text-4xl font-bold text-pink-600">
                {session.averageScore.toFixed(1)}
                <span className="text-lg text-slate-400">
                  /10
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Questions Completed
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                {session.completedQuestions}
                <span className="text-lg text-slate-400">
                  /{session.totalQuestions}
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </p>

              <p className="mt-2 text-xl font-bold text-slate-900">
                {session.status ===
                "completed"
                  ? "Finished"
                  : "In Progress"}
              </p>
            </div>

          </div>
        </section>

        {/* Job Description */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-lg">

          <h2 className="text-xl font-bold text-slate-900">
            Target Job Description
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {session.jobDescription}
          </p>

        </section>

        {/* Questions */}
        <div className="mt-6 space-y-6">

          {session.questions.map(
            (item, index) => (
              <section
                key={index}
                className="rounded-2xl bg-white p-6 shadow-lg"
              >

                {/* Question header */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>
                    <span className="text-sm font-bold text-pink-600">
                      Question {index + 1}
                    </span>

                    <h2 className="mt-2 text-xl font-semibold leading-8 text-slate-900">
                      {item.question}
                    </h2>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {item.category}
                  </span>

                </div>

                {/* Answer */}
                <div className="mt-6">

                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Your Answer
                  </h3>

                  <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    {item.answer?.trim() ? (
                      <p className="whitespace-pre-wrap">
                        {item.answer}
                      </p>
                    ) : (
                      <p className="italic text-slate-400">
                        No answer submitted.
                      </p>
                    )}
                  </div>

                </div>

                {/* Score */}
                <div className="mt-5">

                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Score
                  </h3>

                  <p className="mt-1 text-3xl font-bold text-pink-600">
                    {item.score ?? 0}
                    <span className="text-lg text-slate-400">
                      /10
                    </span>
                  </p>

                </div>

                {/* AI Feedback */}
                {item.feedback && (
                  <div className="mt-5">

                    <h3 className="text-lg font-bold text-slate-900">
                      AI Feedback
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {item.feedback}
                    </p>

                  </div>
                )}

                {/* Strengths */}
                {item.strengths &&
                  item.strengths.length > 0 && (
                    <div className="mt-5">

                      <h3 className="text-lg font-bold text-green-700">
                        ✅ Strengths
                      </h3>

                      <div className="mt-3 space-y-2">
                        {item.strengths.map(
                          (strength, strengthIndex) => (
                            <div
                              key={strengthIndex}
                              className="rounded-lg bg-green-50 p-3 text-sm text-slate-700"
                            >
                              {strength}
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  )}

                {/* Improvements */}
                {item.improvements &&
                  item.improvements.length > 0 && (
                    <div className="mt-5">

                      <h3 className="text-lg font-bold text-orange-700">
                        ⚠️ Areas to Improve
                      </h3>

                      <div className="mt-3 space-y-2">
                        {item.improvements.map(
                          (
                            improvement,
                            improvementIndex
                          ) => (
                            <div
                              key={
                                improvementIndex
                              }
                              className="rounded-lg bg-orange-50 p-3 text-sm text-slate-700"
                            >
                              {improvement}
                            </div>
                          )
                        )}
                      </div>

                    </div>
                  )}

                {/* Better Answer */}
                {item.betterAnswer && (
                  <div className="mt-5">

                    <h3 className="text-lg font-bold text-purple-700">
                      💡 Better Answer
                    </h3>

                    <div className="mt-3 whitespace-pre-wrap rounded-xl bg-purple-50 p-4 text-sm leading-7 text-slate-700">
                      {item.betterAnswer}
                    </div>

                  </div>
                )}

              </section>
            )
          )}

        </div>

      </div>
    </main>
  );
}

export default InterviewHistoryDetail;