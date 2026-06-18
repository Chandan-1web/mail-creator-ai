const dotenv = require("dotenv");
dotenv.config();
const { generateMail } = require("./src/services/gemini.service");

async function test() {
  try {
    const res = await generateMail({
      senderName: "John",
      senderRole: "Manager",
      recipientName: "Alice",
      recipientRole: "Developer",
      orgName: "TechCorp",
      subject: "Project Update",
      keyPoints: "Great work, Keep it up",
      tone: "Friendly"
    });
    console.log("Mail generated:\n", res);
  } catch (e) {
    console.error("Error generating mail:", e);
  }
}
test();
