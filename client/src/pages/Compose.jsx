import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";

export default function Compose() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    subject: location.state?.template?.subject || "",
    recipientName: "",
    recipientRole: location.state?.template?.recipientRole || "",
    senderRole: location.state?.template?.senderRole || "",
    tone: location.state?.template?.tone || "formal",
    keyPoints: location.state?.template?.keyPoints || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/mails", formData);
      navigate(`/mail/${res.data.mail.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
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

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-slate-900 to-slate-900" : "bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50"}`}
    >
      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 ${darkMode ? "bg-slate-900/80" : "bg-white"} backdrop-blur-xl border-b ${darkMode ? "border-slate-700/50" : "border-slate-200/50"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${darkMode ? "bg-purple-600/20 text-purple-400" : "bg-purple-100 text-purple-600"}`}
            >
              ✉️
            </div>
            <span
              className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Mail Creator
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/templates")}
              className={`px-4 py-2 rounded-lg transition duration-300 ${darkMode ? "text-gray-300 hover:bg-slate-800" : "text-gray-700 hover:bg-slate-100"}`}
            >
              📋 Templates
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-4 py-2 rounded-lg transition duration-300 ${darkMode ? "text-gray-300 hover:bg-slate-800" : "text-gray-700 hover:bg-slate-100"}`}
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg ${darkMode ? "bg-purple-600/20 text-purple-400" : "bg-purple-100 text-purple-600"}`}
          >
            ✨
          </div>
          <h2
            className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {location.state?.template
              ? `📋 ${location.state.template.name}`
              : "Compose Mail"}
          </h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            AI will write it perfectly
          </p>
        </div>

        {error && (
          <div
            className={`${darkMode ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-red-50 border-red-200 text-red-600"} border p-4 rounded-xl mb-6 flex items-center gap-2`}
          >
            <span>⚠️</span> {error}
          </div>
        )}

        <div
          className={`${darkMode ? "bg-slate-800/50" : "bg-white"} backdrop-blur-xl rounded-2xl p-8 shadow-xl border ${darkMode ? "border-slate-700/50" : "border-slate-200/50"}`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                📌 Subject
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Request for Leave"
                className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none`}
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  👤 Recipient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mr. Sharma"
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none`}
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  💼 Recipient Role
                </label>
                <input
                  type="text"
                  required
                  placeholder="HR Manager"
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none`}
                  value={formData.recipientRole}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientRole: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  🎯 Your Role
                </label>
                <input
                  type="text"
                  required
                  placeholder="Software Engineer"
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${inputClass} focus:outline-none`}
                  value={formData.senderRole}
                  onChange={(e) =>
                    setFormData({ ...formData, senderRole: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  🎨 Tone
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-xl border transition duration-300 ${selectClass} focus:outline-none`}
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData({ ...formData, tone: e.target.value })
                  }
                >
                  <option value="formal">🏢 Formal</option>
                  <option value="semi-formal">👔 Semi-Formal</option>
                  <option value="polite">🤝 Polite</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                📝 Key Points
              </label>
              <textarea
                required
                rows={5}
                placeholder="What should the mail cover..."
                className={`w-full px-4 py-3 rounded-xl border transition duration-300 resize-none ${textareaClass} focus:outline-none`}
                value={formData.keyPoints}
                onChange={(e) =>
                  setFormData({ ...formData, keyPoints: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition duration-300 ${loading ? "opacity-50" : "hover:shadow-lg hover:shadow-purple-500/20"} bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700`}
            >
              {loading ? "⏳ Generating..." : "✨ Generate Mail"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
