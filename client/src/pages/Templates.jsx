import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

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
      "Requesting leave from [start date] to [end date] due to [reason]. All pending work will be completed before leave. Available on phone/email for urgent matters. Requesting approval for the leave period.",
  },
  {
    id: 2,
    name: "Work From Home Request",
    icon: "🏠",
    category: "HR",
    color: "#06B6D4",
    subject: "Request for Work From Home",
    recipientRole: "Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Requesting permission to work from home on [date/dates] due to [reason]. Work responsibilities will be handled without delay. Will be available during office hours through calls, email, and meetings.",
  },
  {
    id: 3,
    name: "Salary Increment Request",
    icon: "💰",
    category: "HR",
    color: "#F59E0B",
    subject: "Request for Salary Revision",
    recipientRole: "Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Requesting salary revision based on performance, responsibilities, completed projects, and contribution to the team. Mention achievements, duration in company, and expected salary discussion politely.",
  },
  {
    id: 4,
    name: "Resignation Letter",
    icon: "👋",
    category: "HR",
    color: "#EF4444",
    subject: "Resignation Letter",
    recipientRole: "HR Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Submitting resignation from current position effective [date]. Express gratitude for opportunities and learning. Mention notice period, last working day, pending work completion, and support during transition.",
  },
  {
    id: 5,
    name: "Job Application",
    icon: "💼",
    category: "Career",
    color: "#6366F1",
    subject: "Application for [Job Role] Position",
    recipientRole: "HR Recruiter",
    senderRole: "Job Applicant",
    tone: "formal",
    keyPoints:
      "Applying for [job role] at [company name]. Mention education, relevant skills, project experience, interest in the role, and attach resume. Request an opportunity for interview or further discussion.",
  },
  {
    id: 6,
    name: "Internship Application",
    icon: "🎓",
    category: "Career",
    color: "#F97316",
    subject: "Application for Internship Opportunity",
    recipientRole: "HR Manager",
    senderRole: "Student",
    tone: "formal",
    keyPoints:
      "Applying for internship in [domain/department]. Mention course, year, college, technical skills, projects, availability period, eagerness to learn, and request consideration for internship opportunity.",
  },
  {
    id: 7,
    name: "Interview Follow-up",
    icon: "📩",
    category: "Career",
    color: "#8B5CF6",
    subject: "Follow-up Regarding Interview for [Role]",
    recipientRole: "Recruiter",
    senderRole: "Candidate",
    tone: "polite",
    keyPoints:
      "Thank the recruiter for the interview opportunity. Mention interview date and role. Express continued interest in the position. Politely ask for update regarding next steps or selection process.",
  },
  {
    id: 8,
    name: "Offer Acceptance",
    icon: "✅",
    category: "Career",
    color: "#22C55E",
    subject: "Acceptance of Job Offer",
    recipientRole: "HR Manager",
    senderRole: "Selected Candidate",
    tone: "formal",
    keyPoints:
      "Accept the job offer for [role] at [company]. Thank the company for the opportunity. Confirm joining date, acceptance of terms, and willingness to complete onboarding formalities.",
  },
  {
    id: 9,
    name: "Project Status Update",
    icon: "📊",
    category: "Management",
    color: "#3B82F6",
    subject: "Project Status Update",
    recipientRole: "Project Manager",
    senderRole: "Team Member",
    tone: "semi-formal",
    keyPoints:
      "Provide current project progress, completed tasks, pending tasks, blockers, expected completion date, and support required. Keep the update clear, concise, and professional.",
  },
  {
    id: 10,
    name: "Deadline Extension",
    icon: "⏳",
    category: "Management",
    color: "#A855F7",
    subject: "Request for Project Deadline Extension",
    recipientRole: "Project Manager",
    senderRole: "Team Member",
    tone: "formal",
    keyPoints:
      "Request extension for project/task deadline due to [reason]. Mention current progress, reason for delay, revised expected completion date, and assurance of quality delivery.",
  },
  {
    id: 11,
    name: "Meeting Request",
    icon: "📅",
    category: "Management",
    color: "#06B6D4",
    subject: "Request for Meeting",
    recipientRole: "Manager",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Request a meeting to discuss [topic]. Mention purpose, preferred date/time, estimated duration, and willingness to adjust based on recipient availability.",
  },
  {
    id: 12,
    name: "Appreciation Letter",
    icon: "⭐",
    category: "Management",
    color: "#EC4899",
    subject: "Letter of Appreciation",
    recipientRole: "Team Member",
    senderRole: "Manager",
    tone: "polite",
    keyPoints:
      "Appreciate excellent contribution, dedication, teamwork, project completion, or performance. Mention specific achievement and encourage continued good work.",
  },
  {
    id: 13,
    name: "Complaint Letter",
    icon: "⚠️",
    category: "Management",
    color: "#EF4444",
    subject: "Formal Complaint Regarding [Issue]",
    recipientRole: "Concerned Authority",
    senderRole: "Employee",
    tone: "formal",
    keyPoints:
      "Explain the issue clearly with date, place, impact, and previous attempts to resolve it. Request appropriate action politely and professionally.",
  },
  {
    id: 14,
    name: "Client Proposal",
    icon: "📑",
    category: "Business",
    color: "#0EA5E9",
    subject: "Business Proposal for [Project/Service]",
    recipientRole: "Client",
    senderRole: "Business Representative",
    tone: "formal",
    keyPoints:
      "Introduce company/service, explain client problem, propose solution, mention benefits, timeline, pricing or next discussion, and request a meeting or confirmation.",
  },
  {
    id: 15,
    name: "Payment Reminder",
    icon: "💳",
    category: "Business",
    color: "#F59E0B",
    subject: "Payment Reminder for Invoice [Invoice Number]",
    recipientRole: "Client",
    senderRole: "Accounts Executive",
    tone: "polite",
    keyPoints:
      "Politely remind client about pending payment for invoice [number]. Mention due date, amount, payment method, and request confirmation after payment is completed.",
  },
  {
    id: 16,
    name: "Apology for Delay",
    icon: "🙏",
    category: "Business",
    color: "#14B8A6",
    subject: "Apology for Delay in [Work/Delivery/Response]",
    recipientRole: "Client",
    senderRole: "Service Provider",
    tone: "polite",
    keyPoints:
      "Apologize for delay, explain reason briefly without excuses, mention corrective action, provide revised timeline, and assure better communication going forward.",
  },
  {
    id: 17,
    name: "Business Partnership",
    icon: "🤝",
    category: "Business",
    color: "#7C3AED",
    subject: "Proposal for Business Partnership",
    recipientRole: "Business Owner",
    senderRole: "Business Representative",
    tone: "formal",
    keyPoints:
      "Introduce yourself/company, explain partnership idea, benefits for both parties, possible collaboration model, and request a meeting to discuss further.",
  },
  {
    id: 18,
    name: "Customer Support Reply",
    icon: "🎧",
    category: "Support",
    color: "#2563EB",
    subject: "Response Regarding Your Support Request",
    recipientRole: "Customer",
    senderRole: "Support Executive",
    tone: "polite",
    keyPoints:
      "Acknowledge customer issue, apologize for inconvenience, explain solution or next steps, mention expected resolution time, and thank customer for patience.",
  },
  {
    id: 19,
    name: "Refund Request",
    icon: "↩️",
    category: "Support",
    color: "#DC2626",
    subject: "Request for Refund",
    recipientRole: "Support Team",
    senderRole: "Customer",
    tone: "formal",
    keyPoints:
      "Request refund for order/service [details]. Mention payment date, order ID, issue faced, reason for refund, and request confirmation of refund process.",
  },
  {
    id: 20,
    name: "Request for Certificate",
    icon: "📜",
    category: "Academic",
    color: "#14B8A6",
    subject: "Request for Certificate",
    recipientRole: "College Administration",
    senderRole: "Student",
    tone: "formal",
    keyPoints:
      "Request certificate such as bonafide, internship, course completion, or study certificate. Mention student details, purpose, required date, and willingness to provide documents.",
  },
  {
    id: 21,
    name: "College Leave Letter",
    icon: "🏫",
    category: "Academic",
    color: "#F97316",
    subject: "Request for Leave",
    recipientRole: "Class Teacher",
    senderRole: "Student",
    tone: "formal",
    keyPoints:
      "Request leave from college/classes for [dates] due to [reason]. Mention student name, department, semester, assurance to cover missed classes, and request approval.",
  },
  {
    id: 22,
    name: "Recommendation Request",
    icon: "📝",
    category: "Academic",
    color: "#0891B2",
    subject: "Request for Recommendation Letter",
    recipientRole: "Professor",
    senderRole: "Student",
    tone: "polite",
    keyPoints:
      "Request recommendation letter for [job/internship/higher studies]. Mention subject/project completed under professor, achievements, deadline, and documents you can provide.",
  },
  {
    id: 23,
    name: "Permission Letter",
    icon: "🛂",
    category: "Official",
    color: "#4F46E5",
    subject: "Request for Permission",
    recipientRole: "Concerned Authority",
    senderRole: "Applicant",
    tone: "formal",
    keyPoints:
      "Request permission for [event/activity/visit/work]. Mention purpose, date, place, participants if any, responsibility, and request official approval.",
  },
  {
    id: 24,
    name: "Event Invitation",
    icon: "🎉",
    category: "Official",
    color: "#DB2777",
    subject: "Invitation to [Event Name]",
    recipientRole: "Guest",
    senderRole: "Organizer",
    tone: "polite",
    keyPoints:
      "Invite recipient to event. Mention event name, date, time, venue, purpose, guest importance, and request confirmation of presence.",
  },
];

const categories = [
  "All",
  "HR",
  "Career",
  "Management",
  "Business",
  "Support",
  "Academic",
  "Official",
];

export default function Templates() {
  const navigate = useNavigate();
  const { darkMode } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesCategory =
        selectedCategory === "All" || template.category === selectedCategory;

      const matchesSearch =
        !normalizedSearch ||
        template.name.toLowerCase().includes(normalizedSearch) ||
        template.category.toLowerCase().includes(normalizedSearch) ||
        template.subject.toLowerCase().includes(normalizedSearch) ||
        template.keyPoints.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleUseTemplate = (template) => {
    navigate("/compose", { state: { template } });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50"
      }`}
    >
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          darkMode
            ? "bg-slate-900/80 border-slate-700/50"
            : "bg-white/85 border-slate-200/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                darkMode
                  ? "bg-purple-600/20 text-purple-300"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              ✉️
            </div>

            <div>
              <span
                className={`font-bold text-lg block leading-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Mail Creator
              </span>
              <span
                className={`text-xs ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Template Library
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/compose")}
              className={`hidden sm:inline-flex px-4 py-2 rounded-lg font-medium transition duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-slate-800"
                  : "text-gray-700 hover:bg-slate-100"
              }`}
            >
              ✨ Compose
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-slate-800"
                  : "text-gray-700 hover:bg-slate-100"
              }`}
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="text-center mb-8">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg ${
              darkMode
                ? "bg-purple-600/20 text-purple-300"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            📋
          </div>

          <h1
            className={`text-4xl font-extrabold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Mail Templates
          </h1>

          <p
            className={`max-w-2xl mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Choose a ready-made professional template, customize it in Compose,
            and generate your mail instantly with AI.
          </p>
        </section>

        <section
          className={`rounded-2xl border p-5 mb-8 shadow-lg ${
            darkMode
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-white/90 border-slate-200/70"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex-1">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                🔎 Search Templates
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by template, category, subject..."
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition duration-300 ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-600/60 text-white placeholder-gray-500 focus:border-purple-500/60"
                    : "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-purple-500"
                }`}
              />
            </div>

            <div className="lg:min-w-[420px]">
              <label
                className={`block text-sm font-semibold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                🗂️ Category
              </label>

              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                          : darkMode
                            ? "bg-slate-900/60 text-gray-300 hover:bg-slate-700 border border-slate-700"
                            : "bg-slate-100 text-gray-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between mb-5">
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Showing{" "}
            <span className={darkMode ? "text-purple-300" : "text-purple-700"}>
              {filteredTemplates.length}
            </span>{" "}
            template{filteredTemplates.length === 1 ? "" : "s"}
          </p>

          {(searchTerm || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className={`text-sm font-semibold transition ${
                darkMode
                  ? "text-purple-300 hover:text-purple-200"
                  : "text-purple-700 hover:text-purple-800"
              }`}
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredTemplates.length === 0 ? (
          <div
            className={`rounded-2xl border p-10 text-center ${
              darkMode
                ? "bg-slate-800/50 border-slate-700/50"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3
              className={`text-xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No templates found
            </h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Try another search keyword or choose a different category.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className={`group rounded-2xl border p-6 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition duration-300 ${
                  darkMode
                    ? "bg-slate-800/60 border-slate-700/60 hover:border-purple-500/40"
                    : "bg-white border-slate-200 hover:border-purple-200"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      backgroundColor: `${template.color}22`,
                      color: template.color,
                    }}
                  >
                    {template.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-bold text-lg leading-tight mb-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {template.name}
                    </h3>

                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${template.color}18`,
                        color: template.color,
                      }}
                    >
                      {template.category}
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-xl p-4 mb-4 border ${
                    darkMode
                      ? "bg-slate-900/40 border-slate-700/60"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Subject
                  </p>
                  <p
                    className={`text-sm font-semibold line-clamp-2 ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {template.subject}
                  </p>
                </div>

                <p
                  className={`text-sm leading-relaxed mb-5 line-clamp-4 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {template.keyPoints}
                </p>

                <div
                  className={`grid grid-cols-2 gap-3 mb-5 text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div
                    className={`rounded-xl px-3 py-2 ${
                      darkMode ? "bg-slate-900/40" : "bg-slate-50"
                    }`}
                  >
                    <span className="block opacity-70">Recipient</span>
                    <span
                      className={`font-semibold ${
                        darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {template.recipientRole}
                    </span>
                  </div>

                  <div
                    className={`rounded-xl px-3 py-2 ${
                      darkMode ? "bg-slate-900/40" : "bg-slate-50"
                    }`}
                  >
                    <span className="block opacity-70">Tone</span>
                    <span
                      className={`font-semibold capitalize ${
                        darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {template.tone}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUseTemplate(template)}
                  className="w-full py-3 rounded-xl text-white font-bold shadow-lg transition duration-300 group-hover:shadow-xl active:scale-[0.98]"
                  style={{ backgroundColor: template.color }}
                >
                  Use This Template →
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
