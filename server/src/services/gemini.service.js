const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateMail = async ({
  senderName,
  senderRole,
  recipientName,
  recipientRole,
  orgName,
  subject,
  keyPoints,
  tone,
}) => {
  try {
    console.log("Generating mail with Groq...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in writing official, formal business correspondence. Write professional emails in standard official format.",
        },
        {
          role: "user",
          content: `Write a complete official email with these details:
- From: ${senderName} (${senderRole}) at ${orgName || "the organization"}
- To: ${recipientName} (${recipientRole})
- Subject: ${subject}
- Tone: ${tone}
- Key points: ${keyPoints}

Format exactly like this:
Date: [today's date]
To: ${recipientName}
Designation: ${recipientRole}

Subject: ${subject}

Dear ${recipientName},

[Write 3-4 professional paragraphs covering all key points]

Yours sincerely,
${senderName}
${senderRole}
${orgName || ""}

Output only the email, no extra commentary.`,
        },
      ],
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    console.log("Mail generated successfully, length:", text.length);
    return text;
  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    throw error;
  }
};

module.exports = { generateMail };
