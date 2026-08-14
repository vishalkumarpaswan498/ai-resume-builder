import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authServices";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      console.log("Login successful:", data);

      // Save token
      localStorage.setItem("token", data.token);

      //Tell Navbar that login happened
      window.dispatchEvent(new Event("auth-changed"));
      
      // Go to home page
      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">

      <div className="mx-auto max-w-md">

        {/* Heading */}
        <div className="text-center">

          <h1 className="text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-3 text-slate-400">
            Login to continue building your resume
          </p>

        </div>

        {/* Login Card */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>

            {/* Password */}
            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>

            {/* Forgot Password */}
            <div className="mt-3 text-right">

              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>

            </div>

            {/* Error */}
            {error && (
              <p className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}

export default Login;
