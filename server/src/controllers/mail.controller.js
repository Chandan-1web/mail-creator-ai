const { prisma } = require("../config/prisma");
const { generateMail } = require("../services/gemini.service");

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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

    return res.status(201).json({
      message: "Mail generated successfully",
      mail,
    });
  } catch (error) {
    console.error("CREATE MAIL ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to generate mail",
      error: error.message,
    });
  }
};

const getMails = async (req, res) => {
  try {
    const mails = await prisma.mail.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json(mails);
  } catch (error) {
    console.error("GET MAILS ERROR:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getMail = async (req, res) => {
  try {
    const mail = await prisma.mail.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!mail) {
      return res.status(404).json({
        message: "Mail not found",
      });
    }

    return res.json(mail);
  } catch (error) {
    console.error("GET MAIL ERROR:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteMail = async (req, res) => {
  try {
    const result = await prisma.mail.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "Mail not found or you do not have permission to delete it",
      });
    }

    return res.json({
      message: "Mail deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MAIL ERROR:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createMail,
  getMails,
  getMail,
  deleteMail,
};
