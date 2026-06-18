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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center text-white">
          <div className="text-7xl mb-6 animate-bounce">🚀</div>
          <h1 className="text-5xl font-bold mb-4">Get Started Free</h1>
          <p className="text-emerald-200 text-lg max-w-sm mb-8">
            Join thousands generating professional mails
          </p>

          <div className="space-y-2 text-left">
            {[
              "✓ Generate in seconds",
              "✓ Professional always",
              "✓ 9+ Templates",
              "✓ Download PDF",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-emerald-200 text-sm bg-white/5 rounded-lg px-4 py-2 border border-white/10 hover:border-emerald-500/30 hover:bg-white/10 transition"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 lg:hidden">✉️</div>
            <h2 className="text-4xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Start creating amazing mails</p>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl mb-6 text-sm backdrop-blur">
              <div className="flex items-start gap-2">
                <span>⚠️</span>
                <div>
                  <p className="font-semibold text-red-200 mb-1">
                    Please fix the following:
                  </p>
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
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="Your Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition backdrop-blur disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition backdrop-blur disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Organization
              </label>
              <input
                type="text"
                disabled={loading}
                placeholder="Your Company"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition backdrop-blur disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.orgName}
                onChange={(e) => updateField("orgName", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                disabled={loading}
                placeholder="Minimum 6 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition backdrop-blur disabled:opacity-60 disabled:cursor-not-allowed"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 duration-300"
            >
              {loading ? "⏳ Creating..." : "🎉 Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-semibold hover:text-emerald-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
