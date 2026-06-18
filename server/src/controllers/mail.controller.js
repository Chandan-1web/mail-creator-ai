const { PrismaClient } = require("@prisma/client");
const { generateMail } = require("../services/gemini.service");

const prisma = new PrismaClient();

const createMail = async (req, res) => {
  try {
    const {
      subject,
      recipientName,
      recipientRole,
      senderRole,
      tone,
      keyPoints,
    } = req.body;
    const userId = req.user.id;

    console.log("Creating mail for user:", userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.name);

    const generatedBody = await generateMail({
      senderName: user.name,
      senderRole,
      recipientName,
      recipientRole,
      orgName: user.orgName,
      subject,
      keyPoints,
      tone,
    });

    console.log("Mail generated, length:", generatedBody.length);

    const mail = await prisma.mail.create({
      data: {
        subject,
        recipientName,
        recipientRole,
        senderRole,
        tone,
        keyPoints,
        generatedBody,
        userId,
      },
    });

    res.status(201).json({ message: "Mail generated successfully", mail });
  } catch (error) {
    console.error("CREATE MAIL ERROR:", error.message);
    res
      .status(500)
      .json({ message: "Failed to generate mail", error: error.message });
  }
};

const getMails = async (req, res) => {
  try {
    const mails = await prisma.mail.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(mails);
  } catch (error) {
    console.error("GET MAILS ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getMail = async (req, res) => {
  try {
    const mail = await prisma.mail.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!mail) return res.status(404).json({ message: "Mail not found" });
    res.json(mail);
  } catch (error) {
    console.error("GET MAIL ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMail = async (req, res) => {
  try {
    await prisma.mail.delete({ where: { id: req.params.id } });
    res.json({ message: "Mail deleted" });
  } catch (error) {
    console.error("DELETE MAIL ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createMail, getMails, getMail, deleteMail };
