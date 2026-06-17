import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-slate-900">
              Shawn's PaperTrade
            </h1>

            <p className="text-slate-500 mt-2">
              Sign in to your account
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Email
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />

              </div>

            </div>

            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

              </div>

            </div>

            {error && (
              <p className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-slate-900 font-semibold hover:underline"
              >
                Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;