const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createMail,
  getMails,
  getMail,
  deleteMail,
} = require("../controllers/mail.controller");
const { generatePDF } = require("../services/pdf.service");
const { generateMail } = require("../services/gemini.service");
const { prisma } = require("../config/prisma");

const router = express.Router();

router.post("/", authMiddleware, createMail);

router.get("/", authMiddleware, getMails);

router.get("/:id", authMiddleware, getMail);

router.delete("/:id", authMiddleware, deleteMail);

router.post("/:id/regenerate", authMiddleware, async (req, res) => {
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

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const generatedBody = await generateMail({
      senderName: user.name,
      senderRole: mail.senderRole,
      recipientName: mail.recipientName,
      recipientRole: mail.recipientRole,
      orgName: user.orgName,
      subject: mail.subject,
      keyPoints: mail.keyPoints,
      tone: mail.tone,
    });

    const updatedMail = await prisma.mail.update({
      where: { id: mail.id },
      data: { generatedBody },
    });

    return res.json({
      message: "Mail regenerated successfully",
      mail: updatedMail,
    });
  } catch (error) {
    console.error("REGENERATE ERROR:", error.message);

    return res.status(500).json({
      message: "Regeneration failed",
      error: error.message,
    });
  }
});

router.get("/:id/export/pdf", authMiddleware, async (req, res) => {
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

    const pdfBuffer = await generatePDF(mail);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="mail-${mail.id}.pdf"`,
    );

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF EXPORT ERROR:", error.message);

    return res.status(500).json({
      message: "PDF generation failed",
      error: error.message,
    });
  }
});

module.exports = router;
