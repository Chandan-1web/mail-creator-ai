import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";

export default function Compose() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useAuthStore();

  const template = location.state?.template;

  const initialFormData = useMemo(
    () => ({
      subject: template?.subject || "",
      recipientName: "",
      recipientRole: template?.recipientRole || "",
      senderRole: template?.senderRole || "",
      tone: template?.tone || "formal",
      keyPoints: template?.keyPoints || "",
    }),
    [template],
  );

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return undefined;
    }

    setProgress(12);

    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 92) {
          return currentProgress;
        }

        const increment =
          currentProgress < 50 ? 9 : currentProgress < 75 ? 5 : 2;
        return Math.min(currentProgress + increment, 92);
      });
    }, 350);

    return () => clearInterval(interval);
  }, [loading]);

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleClearForm = () => {
    setError("");
    setFormData({
      subject: "",
      recipientName: "",
      recipientRole: "",
      senderRole: "",
      tone: "formal",
      keyPoints: "",
    });
  };

  const handleResetTemplate = () => {
    setError("");
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/mails", formData);
      setProgress(100);

      setTimeout(() => {
        navigate(`/mail/${res.data.mail.id}`);
      }, 350);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate mail");
      setLoading(false);
      setProgress(0);
    }
  };

  const inputClass = darkMode
    ? "bg-slate-900/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
    : "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500";

  const selectClass = darkMode
    ? "bg-slate-900/50 border-slate-600/50 text-white focus:border-purple-500/50"
    : "bg-slate-50 border-slate-200 text-gray-900 focus:border-purple-500";

  const textareaClass = darkMode
    ? "bg-slate-900/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500/50"
    : "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500";

  const secondaryButtonClass = darkMode
    ? "border-slate-600 text-gray-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
    : "border-slate-200 text-gray-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed";

  const generationSteps = [
    "Understanding your details",
    "Creating professional structure",
    "Improving tone and clarity",
    "Finalizing your mail",
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50"
      }`}
    >
      <nav
        className={`sticky top-0 z-50 ${
          darkMode ? "bg-slate-900/80" : "bg-white"
        } backdrop-blur-xl border-b ${
          darkMode ? "border-slate-700/50" : "border-slate-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                darkMode
                  ? "bg-purple-600/20 text-purple-400"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              ✉️
            </div>
            <span
              className={`font-bold text-lg ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Mail Creator
            </span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/templates")}
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-slate-800"
                  : "text-gray-700 hover:bg-slate-100"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              📋 Templates
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-slate-800"
                  : "text-gray-700 hover:bg-slate-100"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg ${
              darkMode
                ? "bg-purple-600/20 text-purple-400"
                : "bg-purple-100 text-purple-600"
            }`}
          >
            ✨
          </div>

          <h2
            className={`text-4xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {template ? `📋 ${template.name}` : "Compose Mail"}
          </h2>

          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            AI will write a polished professional mail from your details.
          </p>
        </div>

        {error && (
          <div
            className={`${
              darkMode
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-red-50 border-red-200 text-red-600"
            } border p-4 rounded-xl mb-6 flex items-center gap-2`}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div
            className={`mb-6 rounded-2xl border p-5 shadow-lg ${
              darkMode
                ? "bg-slate-800/70 border-purple-500/30"
                : "bg-white border-purple-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Generating your professional mail...
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Please wait. Do not refresh the page.
                </p>
              </div>

              <div
                className={`text-xl font-bold ${
                  darkMode ? "text-purple-300" : "text-purple-700"
                }`}
              >
                {progress}%
              </div>
            </div>

            <div
              className={`h-3 rounded-full overflow-hidden ${
                darkMode ? "bg-slate-700" : "bg-slate-100"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {generationSteps.map((step, index) => {
                const isActive = progress >= 20 + index * 20;

                return (
                  <div
                    key={step}
                    className={`text-xs rounded-xl px-3 py-2 border transition ${
                      isActive
                        ? darkMode
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                          : "bg-purple-50 border-purple-200 text-purple-700"
                        : darkMode
                          ? "bg-slate-900/40 border-slate-700 text-gray-500"
                          : "bg-slate-50 border-slate-200 text-gray-500"
                    }`}
                  >
                    {isActive ? "✅" : "○"} {step}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          className={`${
            darkMode ? "bg-slate-800/50" : "bg-white"
          } backdrop-blur-xl rounded-2xl p-8 shadow-xl border ${
            darkMode ? "border-slate-700/50" : "border-slate-200/50"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                📌 Subject
              </label>
              <input
                type="text"
                required
                disabled={loading}
                placeholder="e.g. Request for Leave"
                className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                value={formData.subject}
                onChange={(e) => updateField("subject", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  👤 Recipient Name
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Mr. Sharma"
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                  value={formData.recipientName}
                  onChange={(e) => updateField("recipientName", e.target.value)}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  💼 Recipient Role
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="HR Manager"
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                  value={formData.recipientRole}
                  onChange={(e) => updateField("recipientRole", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  🎯 Your Role
                </label>
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Software Engineer"
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                  value={formData.senderRole}
                  onChange={(e) => updateField("senderRole", e.target.value)}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  🎨 Tone
                </label>
                <select
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${selectClass} focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                  value={formData.tone}
                  onChange={(e) => updateField("tone", e.target.value)}
                >
                  <option value="formal">🏢 Formal</option>
                  <option value="semi-formal">👔 Semi-Formal</option>
                  <option value="polite">🤝 Polite</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                📝 Key Points
              </label>
              <textarea
                required
                rows={5}
                disabled={loading}
                placeholder="What should the mail cover..."
                className={`w-full px-4 py-3 rounded-xl border transition duration-300 resize-none ${textareaClass} focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed`}
                value={formData.keyPoints}
                onChange={(e) => updateField("keyPoints", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleClearForm}
                disabled={loading}
                className={`py-4 rounded-xl font-bold border transition duration-300 ${secondaryButtonClass}`}
              >
                🧹 Clear Form
              </button>

              {template ? (
                <button
                  type="button"
                  onClick={handleResetTemplate}
                  disabled={loading}
                  className={`py-4 rounded-xl font-bold border transition duration-300 ${secondaryButtonClass}`}
                >
                  ↩️ Reset Template
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/templates")}
                  disabled={loading}
                  className={`py-4 rounded-xl font-bold border transition duration-300 ${secondaryButtonClass}`}
                >
                  📋 Use Template
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition duration-300 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-purple-500/20"
              } bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700`}
            >
              {loading ? "⏳ Generating Mail..." : "✨ Generate Mail"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
