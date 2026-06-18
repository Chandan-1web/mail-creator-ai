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
  const [pageLoading, setPageLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchMail = async () => {
      try {
        setPageLoading(true);
        setError("");
        const res = await api.get(`/mails/${id}`);
        setMail(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load mail");
      } finally {
        setPageLoading(false);
      }
    };

    fetchMail();
  }, [id]);

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleCopy = async () => {
    try {
      clearMessages();
      await navigator.clipboard.writeText(mail.generatedBody);
      setCopied(true);
      setSuccessMessage("Mail copied to clipboard.");
      setTimeout(() => {
        setCopied(false);
        setSuccessMessage("");
      }, 2000);
    } catch {
      setError("Unable to copy mail. Please try again.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      clearMessages();
      setPdfLoading(true);

      const res = await api.get(`/mails/${id}/export/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = `mail-${
        mail.subject
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || id
      }.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setSuccessMessage("PDF downloaded successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "PDF download failed");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleOpenGmail = () => {
    clearMessages();

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
      mail.subject,
    )}&body=${encodeURIComponent(mail.generatedBody)}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const handleRegenerate = async () => {
    try {
      clearMessages();
      setRegenerating(true);

      const res = await api.post(`/mails/${id}/regenerate`);
      setMail(res.data.mail);
      setSuccessMessage("Mail regenerated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Mail regeneration failed");
    } finally {
      setRegenerating(false);
    }
  };

  if (pageLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode
            ? "bg-slate-900"
            : "bg-gradient-to-br from-slate-50 to-purple-50"
        }`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">✉️</div>
          <div className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading your mail...
          </div>
        </div>
      </div>
    );
  }

  if (!mail) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-6 ${
          darkMode
            ? "bg-slate-900 text-white"
            : "bg-gradient-to-br from-slate-50 to-purple-50 text-gray-900"
        }`}
      >
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Mail not found</h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
            {error || "This mail may have been deleted or is unavailable."}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const actionButtonClass = darkMode
    ? "bg-slate-700 hover:bg-slate-600 text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
    : "bg-slate-100 hover:bg-slate-200 text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed";

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

          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-2 rounded-lg transition ${
              darkMode
                ? "text-gray-300 hover:bg-slate-800"
                : "text-gray-700 hover:bg-slate-100"
            }`}
          >
            ← Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <h2
                className={`text-3xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Generated Mail ✅
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Ready to review, download, regenerate, or send.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleCopy}
                disabled={pdfLoading || regenerating}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                  copied ? "bg-green-600 text-white" : actionButtonClass
                }`}
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading || regenerating}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${actionButtonClass}`}
              >
                {pdfLoading ? "⏳ Downloading..." : "📄 PDF"}
              </button>

              <button
                onClick={handleOpenGmail}
                disabled={pdfLoading || regenerating}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                  darkMode
                    ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                    : "bg-red-50 hover:bg-red-100 text-red-600"
                }`}
              >
                📧 Gmail
              </button>

              <button
                onClick={handleRegenerate}
                disabled={pdfLoading || regenerating}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${actionButtonClass}`}
              >
                {regenerating ? "✨ Regenerating..." : "🔄 Regenerate"}
              </button>

              <button
                onClick={() => navigate("/compose")}
                disabled={pdfLoading || regenerating}
                className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                ✨ New
              </button>
            </div>
          </div>

          {error && (
            <div
              className={`mb-6 rounded-xl border p-4 ${
                darkMode
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              ⚠️ {error}
            </div>
          )}

          {successMessage && (
            <div
              className={`mb-6 rounded-xl border p-4 ${
                darkMode
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              ✅ {successMessage}
            </div>
          )}

          {regenerating && (
            <div
              className={`mb-6 rounded-xl border p-4 ${
                darkMode
                  ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                  : "bg-purple-50 border-purple-200 text-purple-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                <div>
                  <p className="font-semibold">Generating a fresh version...</p>
                  <p className="text-sm opacity-80">
                    Please wait while AI improves this mail.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Subject", value: mail.subject, icon: "📌" },
              {
                label: "Recipient",
                value: mail.recipientName,
                icon: "👤",
              },
              { label: "Tone", value: mail.tone, icon: "🎨" },
            ].map((item) => (
              <div
                key={item.label}
                className={`${
                  darkMode
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-white border-slate-200"
                } border rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div
                  className={`text-xs font-medium mb-1 ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </div>
                <div
                  className={`font-semibold truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                  title={item.value}
                >
                  {item.value || "Not provided"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <section
          className={`${
            darkMode
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-white border-slate-200"
          } border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300`}
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between gap-3">
            <span className="text-white font-medium text-sm">
              📄 Official Correspondence
            </span>
            <span className="text-white/80 text-xs">
              {new Date(mail.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <pre
              className={`whitespace-pre-wrap font-serif leading-relaxed text-sm sm:text-base ${
                darkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              {mail.generatedBody}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
