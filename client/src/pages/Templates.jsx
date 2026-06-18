import { useState } from "react";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    id: 1,
    name: "Leave Request",
    icon: "🌴",
    category: "HR",
    color: "#10B981",
    subject: "Request for Leave Approval",
    recipientRole: "HR Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Requesting 3 days leave from [start date] to [end date] for personal reasons. All pending work will be completed before leave. Will be available on phone for urgent matters.",
  },
  {
    id: 2,
    name: "Salary Increment",
    icon: "💰",
    category: "HR",
    color: "#F59E0B",
    subject: "Request for Salary Revision",
    recipientRole: "General Manager",
    senderRole: "Senior Employee",
    tone: "formal",
    keyPoints:
      "Working in the company for 2 years. Successfully completed multiple projects. Taken additional responsibilities. Requesting 20% salary increment based on performance and market standards.",
  },
  {
    id: 3,
    name: "Resignation Letter",
    icon: "👋",
    category: "HR",
    color: "#EF4444",
    subject: "Resignation Letter",
    recipientRole: "HR Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Resigning from current position effective [date]. Grateful for the opportunities provided. Will complete all pending work and assist in transition. Last working day will be [date].",
  },
  {
    id: 4,
    name: "Project Update",
    icon: "📊",
    category: "Management",
    color: "#3B82F6",
    subject: "Project Status Update",
    recipientRole: "Project Manager",
    senderRole: "Developer",
    tone: "semi-formal",
    keyPoints:
      "Completed 80% of the assigned module. Facing minor delays due to requirement changes. Expected completion by [date]. Need approval for additional resources.",
  },
  {
    id: 5,
    name: "Complaint Letter",
    icon: "⚠️",
    category: "Management",
    color: "#8B5CF6",
    subject: "Formal Complaint Regarding Workplace Issue",
    recipientRole: "HR Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Facing issues with [problem description]. The issue has been ongoing for [duration]. Previous attempts to resolve informally were unsuccessful. Requesting immediate action.",
  },
  {
    id: 6,
    name: "Appreciation Letter",
    icon: "⭐",
    category: "Management",
    color: "#EC4899",
    subject: "Letter of Appreciation",
    recipientRole: "Team Member",
    senderRole: "Manager",
    tone: "polite",
    keyPoints:
      "Appreciating outstanding performance on [project]. The work was completed ahead of schedule with excellent quality. Team efforts are recognized and valued. Encouraging continued excellence.",
  },
  {
    id: 7,
    name: "Meeting Request",
    icon: "📅",
    category: "Management",
    color: "#06B6D4",
    subject: "Request for Meeting",
    recipientRole: "Senior Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Requesting a meeting to discuss [topic]. Available on [dates and times]. Meeting duration approximately 30 minutes. Will share agenda beforehand.",
  },
  {
    id: 8,
    name: "Internship Request",
    icon: "🎓",
    category: "Academic",
    color: "#F97316",
    subject: "Application for Internship Opportunity",
    recipientRole: "HR Manager",
    senderRole: "Student",
    tone: "formal",
    keyPoints:
      "Final year student pursuing [degree]. Interested in internship in [department]. Have relevant skills in [skills]. Available from [date]. Eager to contribute and learn.",
  },
  {
    id: 9,
    name: "Recommendation Request",
    icon: "📝",
    category: "Academic",
    color: "#14B8A6",
    subject: "Request for Recommendation Letter",
    recipientRole: "Professor",
    senderRole: "Student",
    tone: "polite",
    keyPoints:
      "Requesting recommendation letter for [purpose]. Studied under your guidance in [subject]. Achieved [accomplishments]. Need letter by [date]. Will provide all necessary details.",
  },
];

const categories = ["All", "HR", "Management", "Academic"];

export default function Templates() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("All");
  const filtered =
    selected === "All"
      ? templates
      : templates.filter((t) => t.category === selected);

  const handleUseTemplate = (template) => {
    navigate("/compose", { state: { template } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
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
            }}
          >
            ✉️
          </div>
          <span style={{ fontWeight: 700, fontSize: "18px", color: "white" }}>
            Mail Creator
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "10px 18px",
            borderRadius: "12px",
            fontWeight: 500,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "white",
              margin: "0 0 8px",
            }}
          >
            📋 Mail Templates
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "16px",
              margin: 0,
            }}
          >
            Choose a template and generate your mail instantly
          </p>
        </div>

        {/* Category Filter */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                background:
                  selected === cat ? "white" : "rgba(255,255,255,0.15)",
                color: selected === cat ? "#7C3AED" : "white",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((template) => (
            <div
              key={template.id}
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: template.color + "20",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {template.icon}
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {template.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: template.color + "20",
                      color: template.color,
                    }}
                  >
                    {template.category}
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginBottom: "16px",
                  lineHeight: 1.6,
                }}
              >
                {template.keyPoints.substring(0, 100)}...
              </p>
              <button
                onClick={() => handleUseTemplate(template)}
                style={{
                  width: "100%",
                  background: template.color,
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Use This Template →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
