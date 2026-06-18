import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../lib/axios";

export default function MailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useAuthStore();
  const [mail, setMail] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/mails/${id}`).then((res) => setMail(res.data));
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mail.generatedBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.generatedBody)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleRegenerate = () => {
    navigate("/compose", {
      state: {
        template: {
          subject: mail.subject,
          recipientRole: mail.recipientRole,
          tone: mail.tone,
        },
      },
    });
  };

  if (!mail)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-purple-50"}`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">✉️</div>
          <div className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading your mail...
          </div>
        </div>
      </div>
    );

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
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-2 rounded-lg transition ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          >
            ← Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <h2
                className={`text-3xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Generated Mail ✅
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Ready to send
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${copied ? (darkMode ? "bg-green-600 text-white" : "bg-green-600 text-white") : darkMode ? "bg-slate-700 hover:bg-slate-600 text-gray-300" : "bg-slate-100 hover:bg-slate-200 text-gray-700"}`}
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-gray-300" : "bg-slate-100 hover:bg-slate-200 text-gray-700"}`}
              >
                📄 PDF
              </button>
              <button
                onClick={handleOpenGmail}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${darkMode ? "bg-red-600/20 hover:bg-red-600/30 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"}`}
              >
                📧 Gmail
              </button>
              <button
                onClick={handleRegenerate}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-gray-300" : "bg-slate-100 hover:bg-slate-200 text-gray-700"}`}
              >
                🔄 Regenerate
              </button>
              <button
                onClick={() => navigate("/compose")}
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition duration-300"
              >
                ✨ New
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Subject", value: mail.subject, icon: "📌" },
              {
                label: "Recipient",
                value: `${mail.recipientName}`,
                icon: "👤",
              },
              { label: "Tone", value: mail.tone, icon: "🎨" },
            ].map((item, i) => (
              <div
                key={i}
                className={`${darkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"} border rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div
                  className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  {item.label}
                </div>
                <div
                  className={`font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mail Body */}
        <div
          className={`${darkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"} border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300`}
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center gap-2">
            <span className="text-white font-medium text-sm">
              📄 Official Correspondence
            </span>
          </div>
          <div className="p-8">
            <pre
              className={`whitespace-pre-wrap font-serif leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-800"}`}
            >
              {mail.generatedBody}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
