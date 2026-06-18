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

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
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
      const res = await api.post("/auth/register", formData);
      setAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setErrors(
        getErrorMessages(err, "Registration failed. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20" />
        <div className="absolute top-24 right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-16 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md text-white">
          <div className="text-7xl mb-8 text-center animate-bounce">🚀</div>

          <h1 className="text-5xl font-extrabold mb-5 text-center">
            Get Started Free
          </h1>

          <p className="text-emerald-100 text-lg text-center mb-10 leading-relaxed">
            Join thousands generating clean, professional, AI-powered official
            mails in seconds.
          </p>

          <div className="space-y-3">
            {[
              "Generate professional mails in seconds",
              "Use real-world industry templates",
              "Download polished PDF copies",
              "Create mails with AI assistance",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-emerald-50 text-sm bg-white/10 rounded-xl px-4 py-3 border border-white/15 backdrop-blur hover:bg-white/15 transition"
              >
                <span className="text-emerald-300">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
              ✉️
            </div>

            <h2 className="text-4xl font-extrabold text-slate-950">
              Create Account
            </h2>

            <p className="text-slate-500 mt-2">
              Start creating professional mails with AI
            </p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
              <div className="flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-semibold mb-1">Please fix this:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Your Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="your@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Organization
              </label>
              <input
                type="text"
                disabled={loading}
                placeholder="Your Company / College"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.orgName}
                onChange={(e) => updateField("orgName", e.target.value)}
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
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3.5 rounded-xl font-bold hover:from-emerald-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              {loading ? "⏳ Creating Account..." : "🎉 Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have account?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-bold hover:text-emerald-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
