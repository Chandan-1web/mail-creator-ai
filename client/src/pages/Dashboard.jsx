import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../lib/axios";

function AnimatedCounter({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const duration = 700;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = Number(value) || 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(
        startValue + (endValue - startValue) * easedProgress,
      );

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <>{displayValue}</>;
}

export default function Dashboard() {
  const { user, logout, darkMode, toggleDarkMode } = useAuthStore();
  const navigate = useNavigate();

  const [mails, setMails] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTone, setFilterTone] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const fetchMails = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/mails");
        setMails(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load mails");
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = async (e, mailId) => {
    e.stopPropagation();

    const confirmed = window.confirm("Delete this mail?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(mailId);
      setError("");

      await api.delete(`/mails/${mailId}`);
      setMails((currentMails) =>
        currentMails.filter((mail) => mail.id !== mailId),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete mail");
    } finally {
      setDeletingId("");
    }
  };

  const filteredMails = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return mails
      .filter((mail) => filterTone === "all" || mail.tone === filterTone)
      .filter((mail) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          mail.subject?.toLowerCase().includes(normalizedSearch) ||
          mail.recipientName?.toLowerCase().includes(normalizedSearch) ||
          mail.recipientRole?.toLowerCase().includes(normalizedSearch)
        );
      });
  }, [mails, search, filterTone]);

  const stats = useMemo(() => {
    const now = new Date();

    const formalCount = mails.filter((mail) => mail.tone === "formal").length;

    const thisMonthCount = mails.filter((mail) => {
      const createdAt = new Date(mail.createdAt);

      return (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }).length;

    const politeCount = mails.filter((mail) => mail.tone === "polite").length;

    return [
      {
        label: "Total Mails",
        value: mails.length,
        icon: "📬",
        description: "All generated mails",
      },
      {
        label: "Formal Mails",
        value: formalCount,
        icon: "💼",
        description: "Professional tone",
      },
      {
        label: "This Month",
        value: thisMonthCount,
        icon: "📅",
        description: "Created this month",
      },
      {
        label: "Polite Mails",
        value: politeCount,
        icon: "🤝",
        description: "Polite tone mails",
      },
    ];
  }, [mails]);

  const toneStyles = {
    formal: darkMode
      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
      : "bg-indigo-50 text-indigo-700 border-indigo-200",
    "semi-formal": darkMode
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      : "bg-emerald-50 text-emerald-700 border-emerald-200",
    polite: darkMode
      ? "bg-orange-500/10 text-orange-300 border-orange-500/30"
      : "bg-orange-50 text-orange-700 border-orange-200",
  };

  const pageClass = darkMode
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    : "bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50";

  const cardClass = darkMode
    ? "bg-slate-800/60 border-slate-700/60"
    : "bg-white/90 border-slate-200/70";

  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageClass}`}>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          darkMode
            ? "bg-slate-900/80 border-slate-700/50"
            : "bg-white/85 border-slate-200/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                  darkMode
                    ? "bg-purple-600/20 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                ✉️
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-lg ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Mail Creator
                  </span>
                  <span
                    className={`hidden sm:inline-flex text-xs px-2 py-1 rounded-full font-bold ${
                      darkMode
                        ? "bg-purple-500/10 text-purple-300"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    AI Powered
                  </span>
                </div>
                <p
                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                >
                  Welcome back, {user?.name || "User"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              className={`lg:hidden w-10 h-10 rounded-xl border transition duration-300 ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-yellow-300"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border ${
                darkMode
                  ? "bg-slate-800/60 border-slate-700 text-gray-300"
                  : "bg-slate-50 border-slate-200 text-gray-700"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="text-sm font-semibold max-w-[150px] truncate">
                {user?.name || "User"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/templates")}
              className={`px-4 py-2 rounded-xl font-bold transition duration-300 ${
                darkMode
                  ? "bg-slate-800/80 text-gray-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-white text-gray-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              📋 Templates
            </button>

            <button
              type="button"
              onClick={() => navigate("/compose")}
              className="px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 transition duration-300"
            >
              ✨ New Mail
            </button>

            <button
              type="button"
              onClick={toggleDarkMode}
              className={`hidden lg:inline-flex px-4 py-2 rounded-xl font-bold transition duration-300 ${
                darkMode
                  ? "bg-slate-800/80 text-yellow-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className={`px-4 py-2 rounded-xl font-bold transition duration-300 ${
                darkMode
                  ? "bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/30"
                  : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1
                className={`text-3xl sm:text-4xl font-extrabold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Dashboard
              </h1>
              <p className={mutedTextClass}>
                Manage your AI-generated official emails in one clean workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/compose")}
              className="w-full md:w-auto px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 transition duration-300"
            >
              ✨ Generate New Mail
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border p-5 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition duration-300 ${cardClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {stat.label}
                    </p>
                    <div
                      className={`text-4xl font-extrabold mt-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        darkMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                      darkMode
                        ? "bg-purple-600/20"
                        : "bg-gradient-to-br from-purple-100 to-indigo-100"
                    }`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`rounded-2xl border p-5 mb-6 shadow-lg ${cardClass}`}
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex-1">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                🔎 Search Mails
              </label>

              <input
                type="text"
                placeholder="Search by subject, recipient, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition duration-300 ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-600/60 text-white placeholder-gray-500 focus:border-purple-500/60"
                    : "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500"
                }`}
              />
            </div>

            <div className="lg:min-w-[440px]">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                🎨 Filter by Tone
              </label>

              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "📋 All" },
                  { key: "formal", label: "🏢 Formal" },
                  { key: "semi-formal", label: "👔 Semi-Formal" },
                  { key: "polite", label: "🤝 Polite" },
                ].map((tone) => {
                  const isSelected = filterTone === tone.key;

                  return (
                    <button
                      key={tone.key}
                      type="button"
                      onClick={() => setFilterTone(tone.key)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                          : darkMode
                            ? "bg-slate-900/60 text-gray-300 hover:bg-slate-700 border border-slate-700"
                            : "bg-slate-100 text-gray-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {tone.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

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

        <section
          className={`rounded-2xl border overflow-hidden shadow-xl ${cardClass}`}
        >
          <div
            className={`px-5 sm:px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
              darkMode ? "border-slate-700/60" : "border-slate-200/70"
            }`}
          >
            <div>
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Mails
              </h2>
              <p className={`text-sm ${mutedTextClass}`}>
                Click any mail to open full details.
              </p>
            </div>

            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              {filteredMails.length} of {mails.length} mails
            </span>
          </div>

          {loading ? (
            <div className="p-5 sm:p-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl p-5 border animate-pulse ${
                    darkMode
                      ? "bg-slate-900/40 border-slate-700/60"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${
                        darkMode ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    />
                    <div className="flex-1 space-y-3">
                      <div
                        className={`h-4 rounded w-2/3 ${
                          darkMode ? "bg-slate-700" : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`h-3 rounded w-1/2 ${
                          darkMode ? "bg-slate-700" : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`h-3 rounded w-24 ${
                          darkMode ? "bg-slate-700" : "bg-slate-200"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMails.length === 0 ? (
            <div className="text-center px-6 py-16">
              <div className="text-6xl mb-4">
                {mails.length === 0 ? "📭" : "🔍"}
              </div>

              <h3
                className={`text-2xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {mails.length === 0 ? "No mails yet" : "No results found"}
              </h3>

              <p className={`${mutedTextClass} mb-6 max-w-md mx-auto`}>
                {mails.length === 0
                  ? "Create your first AI-generated official mail and it will appear here."
                  : "Try changing the search keyword or selecting another tone filter."}
              </p>

              {mails.length === 0 ? (
                <button
                  type="button"
                  onClick={() => navigate("/compose")}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 transition duration-300"
                >
                  ✨ Create First Mail
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilterTone("all");
                  }}
                  className={`px-6 py-3 rounded-xl font-bold border transition duration-300 ${
                    darkMode
                      ? "border-slate-600 text-gray-300 hover:bg-slate-700"
                      : "border-slate-200 text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
              {filteredMails.map((mail) => (
                <article
                  key={mail.id}
                  onClick={() => navigate(`/mail/${mail.id}`)}
                  className={`group p-5 sm:p-6 cursor-pointer transition duration-300 ${
                    darkMode ? "hover:bg-slate-900/40" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        darkMode
                          ? "bg-purple-600/20"
                          : "bg-gradient-to-br from-purple-100 to-indigo-100"
                      }`}
                    >
                      📧
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className={`font-bold text-base sm:text-lg truncate ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {mail.subject}
                          </h3>

                          <p
                            className={`text-sm mt-1 truncate ${mutedTextClass}`}
                          >
                            To: {mail.recipientName || "Recipient"} ·{" "}
                            {mail.recipientRole || "Role"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, mail.id)}
                          disabled={deletingId === mail.id}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            darkMode
                              ? "bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20"
                              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          }`}
                          title="Delete mail"
                        >
                          {deletingId === mail.id ? "…" : "🗑️"}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                            toneStyles[mail.tone] ||
                            (darkMode
                              ? "bg-slate-700 text-gray-300 border-slate-600"
                              : "bg-slate-100 text-gray-700 border-slate-200")
                          }`}
                        >
                          {mail.tone || "tone"}
                        </span>

                        <span
                          className={`text-xs ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          •
                        </span>

                        <span
                          className={`text-xs font-medium ${
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {mail.createdAt
                            ? new Date(mail.createdAt).toLocaleDateString()
                            : "No date"}
                        </span>

                        <span
                          className={`ml-auto hidden sm:inline-flex text-xs font-bold opacity-0 group-hover:opacity-100 transition ${
                            darkMode ? "text-purple-300" : "text-purple-700"
                          }`}
                        >
                          Open →
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
