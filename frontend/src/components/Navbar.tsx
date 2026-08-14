import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authServices";

type User = {
  id: string;
  name: string;
  email: string;
};

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const data = await getCurrentUser();

      setUser(data.user || data);
    } catch (error) {
      console.error(
        "Failed to get current user:",
        error
      );

      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleAuthChange = () => {
      fetchUser();
    };

    window.addEventListener(
      "auth-changed",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-changed",
        handleAuthChange
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(null);

    window.dispatchEvent(
      new Event("auth-changed")
    );

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          AI Resume Builder
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5">

          <Link
            to="/"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            About
          </Link>

          <Link
            to="/my-resumes"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            My Resumes
          </Link>

          {user && (
            <>
              <Link
                to="/ats-checker"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                ATS Checker
              </Link>

              <Link
                to="/cover-letter"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Cover Letter
              </Link>

              <Link
                to="/interview-coach"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Interview Coach
              </Link>

              <Link
  to="/interview-history"
  className="font-medium text-gray-700 transition hover:text-blue-600"
>
  Interview History
</Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="font-medium text-gray-700">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;