import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CreateResume from "./pages/CreateResume";
import MyResumes from "./pages/MyResumes";
import ResumePreview from "./pages/ResumePreview";
import EditResume from "./pages/EditResume";

import ATSScore from "./pages/ATSScore";
import ATSAnalyzer from "./pages/ATSAnalyzer";
import ATSChecker from "./pages/ATSChecker";

import CoverLetter from "./pages/CoverLetter";
import InterviewCoach from "./pages/InterviewCoach";
import About from "./pages/About";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewHistoryDetail from "./pages/InterviewHistoryDetail";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Resume */}
        <Route
          path="/create-resume"
          element={<CreateResume />}
        />

        <Route
          path="/my-resumes"
          element={<MyResumes />}
        />

        <Route
          path="/resume/:id"
          element={<ResumePreview />}
        />

        <Route
          path="/edit-resume/:id"
          element={<EditResume />}
        />

        {/* ATS */}
        <Route
          path="/ats-score"
          element={<ATSScore />}
        />

        <Route
          path="/ats-analyzer"
          element={<ATSAnalyzer />}
        />

        <Route
          path="/ats-checker"
          element={<ATSChecker />}
        />

        {/* AI Cover Letter */}
        <Route
          path="/cover-letter"
          element={<CoverLetter />}
        />

        {/* AI Interview Coach */}
        <Route
          path="/interview-coach"
          element={<InterviewCoach />}
        />

        <Route
          path="/about"
          element={<About />}
        />


        <Route
  path="/interview-history"
  element={<InterviewHistory />}
/>

<Route
  path="/interview-history/:id"
  element={<InterviewHistoryDetail />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;