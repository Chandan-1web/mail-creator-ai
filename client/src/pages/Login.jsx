import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";

const getErrorMessages = (err, fallbackMessage) => {
  const responseData = err.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors.map((error) => error.message);
  }

  if (responseData?.message) {
    return [responseData.message];
  }

  return [fallbackMessage];
};

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const res = await api.post("/auth/login", formData);
      setAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setErrors(getErrorMessages(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden bg-gradient-to-br from-purple-950 via-violet-900 to-indigo-950">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-indigo-500/20" />
        <div className="absolute top-24 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-16 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md text-white">
          <div className="text-7xl mb-8 text-center animate-bounce">✉️</div>

          <h1 className="text-5xl font-extrabold mb-5 text-center">
            Mail Creator
          </h1>

          <p className="text-purple-100 text-lg text-center mb-10 leading-relaxed">
            Generate professional official mails instantly with AI-powered
            writing assistance.
          </p>

          <div className="space-y-3">
            {[
              "AI-powered mail generation",
              "Industry-ready mail templates",
              "PDF export and Gmail support",
              "Clean dashboard with dark mode",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-purple-50 text-sm bg-white/10 rounded-xl px-4 py-3 border border-white/15 backdrop-blur hover:bg-white/15 transition"
              >
                <span className="text-purple-300">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
              ✉️
            </div>

            <h2 className="text-4xl font-extrabold text-slate-950">
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to continue creating professional mails
            </p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
              <div className="flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-semibold mb-1">Unable to sign in:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="your@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                placeholder="Enter your password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
            >
              {loading ? "⏳ Signing In..." : "🚀 Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have account?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-bold hover:text-purple-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
