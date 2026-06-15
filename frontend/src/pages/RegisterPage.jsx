import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";

function RegisterPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const response = await api.post(
        "/api/auth/register",
        {
          name,
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
        "Registeration failed"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold text-slate-900">
              PaperTrade
            </h1>

            <p className="text-slate-500 mt-2">
              Register your account
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Name
              </label>

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />

            </div>

            {error && (
              <p style={{ color: "red" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition"
            >
              {loading ? "Logging In..." : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-slate-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-slate-900 font-semibold"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;
