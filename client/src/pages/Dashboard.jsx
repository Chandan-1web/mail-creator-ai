import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../lib/axios";

export default function Dashboard() {
  const { user, logout, darkMode, toggleDarkMode } = useAuthStore();
  const navigate = useNavigate();
  const [mails, setMails] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTone, setFilterTone] = useState("all");

  useEffect(() => {
    api
      .get("/mails")
      .then((res) => setMails(Array.isArray(res.data) ? res.data : []));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = async (e, mailId) => {
    e.stopPropagation();
    if (window.confirm("Delete this mail?")) {
      await api.delete(`/mails/${mailId}`);
      setMails(mails.filter((m) => m.id !== mailId));
    }
  };

  const filteredMails = mails
    .filter((m) => filterTone === "all" || m.tone === filterTone)
    .filter(
      (m) =>
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.recipientName.toLowerCase().includes(search.toLowerCase()),
    );

  const toneColors = {
    formal: { bg: "#EEF2FF", text: "#4338CA", border: "#C7D2FE" },
    "semi-formal": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
    polite: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  };

  const bg = darkMode
    ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <div style={{ minHeight: "100vh", background: bg }}>
      {/* Navbar */}
      <nav
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          padding: "0 2rem",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            ✉️
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "white" }}>
              Mail Creator
            </span>
            <span
              style={{
                marginLeft: "8px",
                fontSize: "11px",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                padding: "2px 8px",
                borderRadius: "20px",
                fontWeight: 500,
              }}
            >
              AI Powered
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.15)",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "rgba(255,255,255,0.3)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>
              {user?.name}
            </span>
          </div>
          <button
            onClick={() => navigate("/templates")}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            📋 Templates
          </button>
          <button
            onClick={() => navigate("/compose")}
            style={{
              background: "white",
              color: "#7C3AED",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            ✨ New Mail
          </button>
          <button
            onClick={toggleDarkMode}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: 500,
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "10px 16px",
              borderRadius: "12px",
              fontWeight: 500,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "2rem",
          }}
        >
          {[
            { label: "Total Mails", value: mails.length, icon: "📬" },
            {
              label: "Formal Mails",
              value: mails.filter((m) => m.tone === "formal").length,
              icon: "💼",
            },
            {
              label: "This Month",
              value: mails.filter(
                (m) =>
                  new Date(m.createdAt).getMonth() === new Date().getMonth(),
              ).length,
              icon: "📅",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "20px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                {stat.icon}
              </div>
              <div
                style={{ fontSize: "36px", fontWeight: 800, color: "white" }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: "20px",
            padding: "1rem 1.5rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "16px",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by subject or recipient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.9)",
                border: "none",
                borderRadius: "12px",
                padding: "10px 14px 10px 40px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["all", "formal", "semi-formal", "polite"].map((tone) => (
              <button
                key={tone}
                onClick={() => setFilterTone(tone)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  background:
                    filterTone === tone ? "white" : "rgba(255,255,255,0.2)",
                  color: filterTone === tone ? "#7C3AED" : "white",
                  transition: "all 0.2s",
                }}
              >
                {tone === "all"
                  ? "📋 All"
                  : tone === "formal"
                    ? "🏢 Formal"
                    : tone === "semi-formal"
                      ? "👔 Semi-Formal"
                      : "🤝 Polite"}
              </button>
            ))}
          </div>
        </div>

        {/* Mail List */}
        <div
          style={{
            background: darkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.95)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              padding: "1.5rem 2rem",
              borderBottom: darkMode
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #F3F4F6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: darkMode ? "white" : "#111827",
                margin: 0,
              }}
            >
              Your Mails
            </h2>
            <span
              style={{
                fontSize: "13px",
                color: darkMode ? "rgba(255,255,255,0.5)" : "#9CA3AF",
              }}
            >
              {filteredMails.length} of {mails.length} mails
            </span>
          </div>

          {filteredMails.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>
                {mails.length === 0 ? "📭" : "🔍"}
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: darkMode ? "white" : "#374151",
                  marginBottom: "8px",
                }}
              >
                {mails.length === 0 ? "No mails yet" : "No results found"}
              </h3>
              <p
                style={{
                  color: darkMode ? "rgba(255,255,255,0.5)" : "#9CA3AF",
                  marginBottom: "2rem",
                }}
              >
                {mails.length === 0
                  ? "Create your first AI-generated official mail"
                  : "Try a different search or filter"}
              </p>
              {mails.length === 0 && (
                <button
                  onClick={() => navigate("/compose")}
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    border: "none",
                    padding: "14px 28px",
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  ✨ Create First Mail
                </button>
              )}
            </div>
          ) : (
            <div>
              {filteredMails.map((mail, idx) => {
                const tone = toneColors[mail.tone] || {
                  bg: "#F9FAFB",
                  text: "#374151",
                  border: "#E5E7EB",
                };
                return (
                  <div
                    key={mail.id}
                    onClick={() => navigate(`/mail/${mail.id}`)}
                    style={{
                      padding: "1.2rem 2rem",
                      borderBottom:
                        idx < filteredMails.length - 1
                          ? darkMode
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "1px solid #F3F4F6"
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = darkMode
                        ? "rgba(255,255,255,0.05)"
                        : "#F9FAFB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "linear-gradient(135deg, #EEF2FF, #C7D2FE)",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        flexShrink: 0,
                      }}
                    >
                      📧
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: darkMode ? "white" : "#111827",
                          fontSize: "15px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {mail.subject}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: darkMode ? "rgba(255,255,255,0.6)" : "#6B7280",
                          marginTop: "2px",
                        }}
                      >
                        To: {mail.recipientName} · {mail.recipientRole}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 10px",
                            borderRadius: "20px",
                            background: tone.bg,
                            color: tone.text,
                            border: `1px solid ${tone.border}`,
                          }}
                        >
                          {mail.tone}
                        </span>
                        <span style={{ fontSize: "12px", color: "#D1D5DB" }}>
                          •
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: darkMode
                              ? "rgba(255,255,255,0.4)"
                              : "#9CA3AF",
                          }}
                        >
                          {new Date(mail.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, mail.id)}
                      style={{
                        background: "#FEF2F2",
                        color: "#EF4444",
                        border: "1px solid #FECACA",
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "16px",
                        flexShrink: 0,
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
