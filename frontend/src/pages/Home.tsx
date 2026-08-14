import { Link } from "react-router-dom";


function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-24">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left Side */}
            <div>

              {/* Small Badge */}
              <div className="mb-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                ✨ AI-Powered Resume Builder
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl">

                Build a Resume

                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  That Gets Noticed.
                </span>

              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                Create a professional, ATS-friendly resume in minutes.
                Let AI improve your resume and help you stand out from
                the competition.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                 to="/create-resume"
                 className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500"
                >
                  Create My Resume →
               </Link>

                <button className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-slate-300 transition hover:bg-slate-800">
                  View Templates
                </button>

              </div>

              {/* Features */}
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">

                <span>✓ ATS Friendly</span>

                <span>✓ AI Powered</span>

                <span>✓ Professional Templates</span>

              </div>

            </div>

            {/* Right Side */}
            <div className="relative">

              {/* Resume Preview */}
              <div className="relative rotate-2 rounded-2xl bg-white p-6 text-slate-900 shadow-2xl transition hover:rotate-0">

                <h2 className="text-2xl font-bold">
                  Vishal Kumar
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Full Stack Developer
                </p>

                <hr className="my-5" />

                <h3 className="text-sm font-bold text-blue-600">
                  PROFESSIONAL SUMMARY
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Passionate software developer skilled in React,
                  Node.js, MongoDB and Java.
                </p>

                <h3 className="mt-5 text-sm font-bold text-blue-600">
                  SKILLS
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">

                  <span className="rounded bg-slate-100 px-3 py-1 text-xs">
                    React
                  </span>

                  <span className="rounded bg-slate-100 px-3 py-1 text-xs">
                    Node.js
                  </span>

                  <span className="rounded bg-slate-100 px-3 py-1 text-xs">
                    MongoDB
                  </span>

                  <span className="rounded bg-slate-100 px-3 py-1 text-xs">
                    Java
                  </span>

                </div>

                {/* ATS Score */}
                <Link
  to="/ats-checker"
  className="block cursor-pointer rounded-2xl p-6 transition hover:bg-slate-800"
>
  <div className="text-3xl">📊</div>

  <h3 className="mt-4 text-xl font-semibold">
    ATS Score
  </h3>

  <p className="mt-2 text-slate-400">
    Analyze your resume and discover how well it performs
    with Applicant Tracking Systems.
  </p>
</Link>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features Section */}
<section className="bg-slate-900 py-20">

  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    {/* Section Heading */}
    <div className="mx-auto max-w-2xl text-center">

      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        Powerful Features
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Everything You Need to Build a Better Resume
      </h2>

      <p className="mt-4 text-slate-400">
        Create, optimize and improve your resume with
        powerful AI-driven tools.
      </p>

    </div>

    {/* Feature Cards */}
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

  {/* Card 1 - AI Resume Generator */}
<Link
  to="/create-resume"
  className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-2 hover:border-blue-500"
>
  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
    🤖
  </div>

  <h3 className="text-xl font-semibold text-white">
    AI Resume Generator
  </h3>

  <p className="mt-3 leading-6 text-slate-400">
    Generate professional resume content automatically
    using Artificial Intelligence.
  </p>

  <div className="mt-4 text-sm font-semibold text-blue-400">
    Create Resume →
  </div>
</Link>


{/* Card 2 - ATS Score */}
<Link
  to="/ats-checker"
  className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-2 hover:border-purple-500"
>
  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
    📊
  </div>

  <h3 className="text-xl font-semibold text-white">
    ATS Score
  </h3>

  <p className="mt-3 leading-6 text-slate-400">
    Analyze your resume and discover how well it
    performs with Applicant Tracking Systems.
  </p>

  <div className="mt-4 text-sm font-semibold text-purple-400">
    Check ATS Score →
  </div>
</Link>


{/* Card 3 - Job Description Match */}
<Link
  to="/ats-checker"
  className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-2 hover:border-green-500"
>
  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-2xl">
    🎯
  </div>

  <h3 className="text-xl font-semibold text-white">
    Job Description Match
  </h3>

  <p className="mt-3 leading-6 text-slate-400">
    Compare your resume with any job description and
    find missing keywords and skills.
  </p>

  <div className="mt-4 text-sm font-semibold text-green-400">
    Match Resume →
  </div>
</Link>


{/* Card 4 - AI Cover Letter */}
<Link
  to="/cover-letter"
  className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-2 hover:border-yellow-500"
>
  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-2xl">
    ✍️
  </div>

  <h3 className="text-xl font-semibold text-white">
    AI Cover Letter
  </h3>

  <p className="mt-3 leading-6 text-slate-400">
    Generate personalized cover letters based on
    your resume and the job you are applying for.
  </p>

  <div className="mt-4 text-sm font-semibold text-yellow-400">
    Generate Cover Letter →
  </div>
</Link>


{/* Card 5 - AI Interview Coach */}
<Link
  to="/interview-coach"
  className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-2 hover:border-pink-500"
>
  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-2xl">
    🎤
  </div>

  <h3 className="text-xl font-semibold text-white">
    AI Interview Coach
  </h3>

  <p className="mt-3 leading-6 text-slate-400">
    Practice interview questions and improve your
    answers with AI-powered feedback.
  </p>

  <div className="mt-4 text-sm font-semibold text-pink-400">
    Start Interview Practice →
  </div>
</Link>


{/* Card 6 - PDF Export */}
<Link
  to="/my-resumes"
  className="block cursor-pointer rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-2 hover:border-orange-500"
>
  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-2xl">
    📄
  </div>

  <h3 className="text-xl font-semibold text-white">
    PDF Export
  </h3>

  <p className="mt-3 leading-6 text-slate-400">
    Download your professionally designed resume
    as a high-quality PDF.
  </p>

  <div className="mt-4 text-sm font-semibold text-orange-400">
    View My Resumes →
  </div>
</Link>
</div>
</div>

</section>






{/* How It Works Section */}
<section className="bg-slate-950 py-20">

  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    {/* Heading */}
    <div className="mx-auto max-w-2xl text-center">

      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        Simple Process
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Build Your Resume in 4 Simple Steps
      </h2>

      <p className="mt-4 text-slate-400">
        Creating a professional resume doesn't have to be difficult.
        Let our AI guide you through the entire process.
      </p>

    </div>

    {/* Steps */}
    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      {/* Step 1 */}
      <div className="relative text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold shadow-lg shadow-blue-600/20">
          1
        </div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          Enter Your Details
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Add your personal information, education, skills,
          projects and work experience.
        </p>

      </div>

      {/* Step 2 */}
      <div className="relative text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold shadow-lg shadow-purple-600/20">
          2
        </div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          Let AI Build Your Resume
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Our AI transforms your information into professional
          and impactful resume content.
        </p>

      </div>

      {/* Step 3 */}
      <div className="relative text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold shadow-lg shadow-green-600/20">
          3
        </div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          Check Your ATS Score
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Analyze your resume against ATS systems and get
          actionable improvement suggestions.
        </p>

      </div>

      {/* Step 4 */}
      <div className="relative text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-2xl font-bold shadow-lg shadow-orange-600/20">
          4
        </div>

        <h3 className="mt-6 text-xl font-semibold text-white">
          Download & Apply
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Download your polished resume as a PDF and start
          applying for your dream jobs.
        </p>

      </div>

    </div>

  </div>

</section>




{/* ATS Score Section */}
<section className="bg-slate-900 py-20">

  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    <div className="grid items-center gap-12 lg:grid-cols-2">

      {/* Left Content */}
      <div>

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          AI Resume Analysis
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Know How Strong Your Resume Really Is
        </h2>

        <p className="mt-5 max-w-xl text-slate-400 leading-7">
          Our AI analyzes your resume against important factors
          such as keywords, skills, formatting and job description
          matching to help you create a stronger application.
        </p>

        {/* Checklist */}
        <div className="mt-8 space-y-4">

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              ✓
            </div>

            <span className="text-slate-300">
              Keyword Optimization
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              ✓
            </div>

            <span className="text-slate-300">
              Resume Structure Analysis
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              ✓
            </div>

            <span className="text-slate-300">
              Skills & Job Match
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              ✓
            </div>

            <span className="text-slate-300">
              Personalized Suggestions
            </span>
          </div>

        </div>

      </div>

      {/* Right Score Card */}
      <div className="flex justify-center">

        <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-2xl">

          <div className="text-center">

            <p className="text-sm font-medium text-slate-400">
              Your ATS Score
            </p>

            {/* Score Circle */}
            <div className="mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-full border-[12px] border-blue-500 shadow-lg shadow-blue-500/20">

              <div>

                <p className="text-5xl font-bold text-white">
                  92
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  out of 100
                </p>

              </div>

            </div>

            <p className="mt-6 text-xl font-semibold text-green-400">
              Excellent Match 🎉
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Your resume is optimized for ATS systems.
            </p>

          </div>

          {/* Score Details */}
          <div className="mt-8 space-y-5">

            {/* Keywords */}
            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="text-slate-400">
                  Keywords
                </span>

                <span className="text-white">
                  95%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-800">

                <div className="h-2 w-[95%] rounded-full bg-blue-500" />

              </div>

            </div>

            {/* Skills */}
            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="text-slate-400">
                  Skills Match
                </span>

                <span className="text-white">
                  90%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-800">

                <div className="h-2 w-[90%] rounded-full bg-purple-500" />

              </div>

            </div>

            {/* Formatting */}
            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="text-slate-400">
                  Formatting
                </span>

                <span className="text-white">
                  92%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-800">

                <div className="h-2 w-[92%] rounded-full bg-green-500" />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>






{/* Resume Templates Section */}
<section className="bg-slate-950 py-20">

  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    {/* Heading */}
    <div className="mx-auto max-w-2xl text-center">

      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        Professional Templates
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Choose a Resume Style That Fits You
      </h2>

      <p className="mt-4 text-slate-400">
        Start with a professionally designed template and
        customize it according to your career.
      </p>

    </div>

    {/* Templates */}
    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

      {/* Template 1 */}
      <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-2 hover:border-blue-500">

        {/* Resume Preview */}
        <div className="rounded-xl bg-white p-5 text-slate-900 shadow-lg">

          <div className="border-b border-slate-200 pb-4">

            <div className="h-5 w-32 rounded bg-slate-800" />

            <div className="mt-2 h-3 w-24 rounded bg-slate-300" />

          </div>

          <div className="mt-5">

            <div className="h-3 w-24 rounded bg-blue-500" />

            <div className="mt-3 space-y-2">

              <div className="h-2 w-full rounded bg-slate-200" />

              <div className="h-2 w-5/6 rounded bg-slate-200" />

              <div className="h-2 w-4/6 rounded bg-slate-200" />

            </div>

          </div>

          <div className="mt-5">

            <div className="h-3 w-20 rounded bg-blue-500" />

            <div className="mt-3 flex gap-2">

              <div className="h-6 w-16 rounded bg-slate-100" />

              <div className="h-6 w-16 rounded bg-slate-100" />

              <div className="h-6 w-16 rounded bg-slate-100" />

            </div>

          </div>

        </div>

        {/* Template Info */}
        <div className="mt-5">

          <h3 className="text-xl font-semibold text-white">
            Classic
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Clean and professional design suitable for
            most industries.
          </p>

          <button className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-500">
            Use Template
          </button>

        </div>

      </div>


      {/* Template 2 */}
      <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-2 hover:border-purple-500">

        {/* Resume Preview */}
        <div className="rounded-xl bg-white p-5 text-slate-900 shadow-lg">

          <div className="flex gap-4 border-b border-slate-200 pb-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-xl">
              VK
            </div>

            <div>

              <div className="h-5 w-32 rounded bg-slate-800" />

              <div className="mt-2 h-3 w-24 rounded bg-slate-300" />

            </div>

          </div>

          <div className="mt-5">

            <div className="h-3 w-24 rounded bg-purple-500" />

            <div className="mt-3 space-y-2">

              <div className="h-2 w-full rounded bg-slate-200" />

              <div className="h-2 w-5/6 rounded bg-slate-200" />

              <div className="h-2 w-4/6 rounded bg-slate-200" />

            </div>

          </div>

          <div className="mt-5">

            <div className="h-3 w-20 rounded bg-purple-500" />

            <div className="mt-3 flex gap-2">

              <div className="h-6 w-16 rounded bg-purple-50" />

              <div className="h-6 w-16 rounded bg-purple-50" />

              <div className="h-6 w-16 rounded bg-purple-50" />

            </div>

          </div>

        </div>

        {/* Template Info */}
        <div className="mt-5">

          <h3 className="text-xl font-semibold text-white">
            Modern
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            A modern and stylish design for creative
            and technology professionals.
          </p>

          <button className="mt-5 w-full rounded-lg bg-purple-600 py-2.5 font-semibold text-white transition hover:bg-purple-500">
            Use Template
          </button>

        </div>

      </div>


      {/* Template 3 */}
      <div className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-2 hover:border-green-500">

        {/* Resume Preview */}
        <div className="rounded-xl bg-white p-5 text-slate-900 shadow-lg">

          <div className="border-l-4 border-green-500 pl-4">

            <div className="h-5 w-32 rounded bg-slate-800" />

            <div className="mt-2 h-3 w-24 rounded bg-slate-300" />

          </div>

          <div className="mt-6">

            <div className="h-3 w-24 rounded bg-green-500" />

            <div className="mt-3 space-y-2">

              <div className="h-2 w-full rounded bg-slate-200" />

              <div className="h-2 w-5/6 rounded bg-slate-200" />

              <div className="h-2 w-4/6 rounded bg-slate-200" />

            </div>

          </div>

          <div className="mt-5">

            <div className="h-3 w-20 rounded bg-green-500" />

            <div className="mt-3 space-y-2">

              <div className="h-2 w-full rounded bg-slate-200" />

              <div className="h-2 w-4/5 rounded bg-slate-200" />

            </div>

          </div>

        </div>

        {/* Template Info */}
        <div className="mt-5">

          <h3 className="text-xl font-semibold text-white">
            Executive
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Elegant and structured design for experienced
            professionals and executives.
          </p>

          <button className="mt-5 w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-500">
            Use Template
          </button>

        </div>

      </div>

    </div>

  </div>

</section>





{/* CTA Section */}
<section className="relative overflow-hidden bg-blue-600 py-20">

  {/* Background Effects */}
  <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

  <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

  <div className="relative mx-auto max-w-4xl px-6 text-center">

    <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
      Start Your Career Journey
    </p>

    <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
      Ready to Build a Resume That Gets Noticed?
    </h2>

    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
      Create a professional, ATS-friendly resume with AI
      and take the next step toward your dream job.
    </p>

    <button className="mt-8 rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:bg-slate-100">
      Start Building My Resume →
    </button>

    <p className="mt-5 text-sm text-blue-100">
      No credit card required • Start for free
    </p>

  </div>

</section>



{/* Testimonials Section */}
<section className="bg-slate-950 py-20">

  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    {/* Heading */}
    <div className="mx-auto max-w-2xl text-center">

      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        User Stories
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Loved by Job Seekers
      </h2>

      <p className="mt-4 text-slate-400">
        See how candidates are using AI to create better resumes
        and improve their job applications.
      </p>

    </div>

    {/* Testimonials */}
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {/* Testimonial 1 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="text-yellow-400">
          ★★★★★
        </div>

        <p className="mt-5 leading-7 text-slate-300">
          "The AI helped me improve my resume and made my
          experience look much more professional. The ATS
          score feature was especially useful."
        </p>

        <div className="mt-6 flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            RK
          </div>

          <div>

            <p className="font-semibold text-white">
              Rahul Kumar
            </p>

            <p className="text-sm text-slate-500">
              Software Developer
            </p>

          </div>

        </div>

      </div>

      {/* Testimonial 2 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="text-yellow-400">
          ★★★★★
        </div>

        <p className="mt-5 leading-7 text-slate-300">
          "I was struggling with resume formatting. The
          templates made it very easy to create a clean and
          professional resume."
        </p>

        <div className="mt-6 flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
            PS
          </div>

          <div>

            <p className="font-semibold text-white">
              Priya Sharma
            </p>

            <p className="text-sm text-slate-500">
              Marketing Graduate
            </p>

          </div>

        </div>

      </div>

      {/* Testimonial 3 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="text-yellow-400">
          ★★★★★
        </div>

        <p className="mt-5 leading-7 text-slate-300">
          "The job matching feature helped me understand
          which keywords were missing from my resume. Very
          useful for job applications."
        </p>

        <div className="mt-6 flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 font-bold text-white">
            AM
          </div>

          <div>

            <p className="font-semibold text-white">
              Aman Mishra
            </p>

            <p className="text-sm text-slate-500">
              Computer Science Student
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>



{/* FAQ Section */}
<section className="bg-slate-900 py-20">

  <div className="mx-auto max-w-4xl px-6 lg:px-8">

    {/* Heading */}
    <div className="text-center">

      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        FAQ
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        Frequently Asked Questions
      </h2>

      <p className="mt-4 text-slate-400">
        Everything you need to know about our AI Resume Builder.
      </p>

    </div>

    {/* Questions */}
    <div className="mt-12 space-y-4">

      {/* Question 1 */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

        <h3 className="text-lg font-semibold text-white">
          Is the AI Resume Builder free?
        </h3>

        <p className="mt-3 leading-6 text-slate-400">
          You can start creating your resume for free.
          Premium features may be available in our paid plans.
        </p>

      </div>

      {/* Question 2 */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

        <h3 className="text-lg font-semibold text-white">
          Can I download my resume as a PDF?
        </h3>

        <p className="mt-3 leading-6 text-slate-400">
          Yes. Once your resume is ready, you will be able
          to download it as a professionally formatted PDF.
        </p>

      </div>

      {/* Question 3 */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

        <h3 className="text-lg font-semibold text-white">
          What is an ATS score?
        </h3>

        <p className="mt-3 leading-6 text-slate-400">
          ATS stands for Applicant Tracking System. Our AI
          analyzes your resume and estimates how well it
          matches ATS requirements and a specific job description.
        </p>

      </div>

      {/* Question 4 */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

        <h3 className="text-lg font-semibold text-white">
          Can AI improve my resume?
        </h3>

        <p className="mt-3 leading-6 text-slate-400">
          Yes. AI can help improve your professional summary,
          experience descriptions, skills and other resume sections.
        </p>

      </div>

      {/* Question 5 */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">

        <h3 className="text-lg font-semibold text-white">
          Can I choose different resume templates?
        </h3>

        <p className="mt-3 leading-6 text-slate-400">
          Yes. You will be able to choose from multiple
          professionally designed resume templates.
        </p>

      </div>

    </div>

  </div>

</section>



{/* Footer */}
<footer className="border-t border-slate-800 bg-slate-950">

  <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

    <div className="grid gap-10 md:grid-cols-4">

      {/* Brand */}
      <div className="md:col-span-1">

        <h2 className="text-2xl font-bold text-white">
          AI Resume<span className="text-blue-500">.</span>
        </h2>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Build professional, ATS-friendly resumes with
          the power of Artificial Intelligence.
        </p>

      </div>

      {/* Product */}
      <div>

        <h3 className="font-semibold text-white">
          Product
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-slate-400">

          <li className="cursor-pointer hover:text-white">
            AI Resume Builder
          </li>

          <li className="cursor-pointer hover:text-white">
            ATS Checker
          </li>

          <li className="cursor-pointer hover:text-white">
            Resume Templates
          </li>

          <li className="cursor-pointer hover:text-white">
            Cover Letter
          </li>

        </ul>

      </div>

      {/* Resources */}
      <div>

        <h3 className="font-semibold text-white">
          Resources
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-slate-400">

          <li className="cursor-pointer hover:text-white">
            Resume Guide
          </li>

          <li className="cursor-pointer hover:text-white">
            Career Tips
          </li>

          <li className="cursor-pointer hover:text-white">
            Interview Tips
          </li>

          <li className="cursor-pointer hover:text-white">
            FAQ
          </li>

        </ul>

      </div>

      {/* Company */}
      <div>

        <h3 className="font-semibold text-white">
          Company
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-slate-400">

          <li className="cursor-pointer hover:text-white">
            About Us
          </li>

          <li className="cursor-pointer hover:text-white">
            Contact
          </li>

          <li className="cursor-pointer hover:text-white">
            Privacy Policy
          </li>

          <li className="cursor-pointer hover:text-white">
            Terms of Service
          </li>

        </ul>

      </div>

    </div>

    {/* Bottom Footer */}
    <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">

      <p className="text-sm text-slate-500">
        © 2026 AI Resume Builder. All rights reserved.
      </p>

      <div className="flex gap-5 text-sm text-slate-400">

        <span className="cursor-pointer hover:text-white">
          LinkedIn
        </span>

        <span className="cursor-pointer hover:text-white">
          GitHub
        </span>

        <span className="cursor-pointer hover:text-white">
          X
        </span>

      </div>

    </div>

  </div>

</footer>

    </main>
  )
}

export default Home