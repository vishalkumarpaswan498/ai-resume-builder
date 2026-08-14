import { Link } from "react-router-dom";

function About() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl text-center">

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          About Us
        </p>

        <h1 className="mt-4 text-5xl font-bold">
          AI Resume Builder
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
          Build professional ATS-friendly resumes,
          create personalized cover letters, analyze
          your resume with ATS tools, and practice
          interviews with AI-powered features.
        </p>

     <div className="mt-12 grid gap-6 md:grid-cols-3">

  {/* Resume Builder */}
  <Link
    to="/create-resume"
    className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-2 hover:border-blue-500 hover:bg-slate-800"
  >
    <div className="text-4xl">📄</div>

    <h2 className="mt-4 text-xl font-semibold">
      Resume Builder
    </h2>

    <p className="mt-2 text-slate-400">
      Create and edit professional resumes with
      multiple templates.
    </p>

    <div className="mt-4 text-sm font-semibold text-blue-400">
      Create Resume →
    </div>
  </Link>


  {/* ATS Checker */}
  <Link
    to="/ats-checker"
    className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-2 hover:border-purple-500 hover:bg-slate-800"
  >
    <div className="text-4xl">📊</div>

    <h2 className="mt-4 text-xl font-semibold">
      ATS Checker
    </h2>

    <p className="mt-2 text-slate-400">
      Analyze keywords, skills and resume
      compatibility against a job description.
    </p>

    <div className="mt-4 text-sm font-semibold text-purple-400">
      Check ATS Score →
    </div>
  </Link>


  {/* Local AI */}
  <Link
    to="/cover-letter"
    className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-2 hover:border-green-500 hover:bg-slate-800"
  >
    <div className="text-4xl">🤖</div>

    <h2 className="mt-4 text-xl font-semibold">
      Local AI
    </h2>

    <p className="mt-2 text-slate-400">
      Use local AI-powered resume, cover letter
      and interview tools.
    </p>

    <div className="mt-4 text-sm font-semibold text-green-400">
      Explore AI Tools →
    </div>
  </Link>

</div>

      </div>
    </main>
  );
}

export default About;