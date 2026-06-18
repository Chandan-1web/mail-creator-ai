const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createMail,
  getMails,
  getMail,
  deleteMail,
} = require("../controllers/mail.controller");
const { generatePDF } = require("../services/pdf.service");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create mail
router.post("/", authMiddleware, createMail);

// Get all mails
router.get("/", authMiddleware, getMails);

// Get single mail
router.get("/:id", authMiddleware, getMail);

// Delete mail
router.delete("/:id", authMiddleware, deleteMail);

// Regenerate mail
router.post("/:id/regenerate", authMiddleware, async (req, res) => {
  try {
    console.log("Regenerate request for mail:", req.params.id);

    const mail = await prisma.mail.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!mail) {
      return res.status(404).json({ message: "Mail not found" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const { generateMail } = require("../services/gemini.service");
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

    const updated = await prisma.mail.update({
      where: { id: mail.id },
      data: { generatedBody },
    });

    console.log("Mail regenerated successfully");
    res.json({ message: "Mail regenerated", mail: updated });
  } catch (error) {
    console.error("REGENERATE ERROR:", error.message);
    res
      .status(500)
      .json({ message: "Regeneration failed", error: error.message });
  }
});

// Export PDF
router.get("/:id/export/pdf", authMiddleware, async (req, res) => {
  try {
    console.log("PDF export request for mail:", req.params.id);

    const mail = await prisma.mail.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!mail) {
      return res.status(404).json({ message: "Mail not found" });
    }

    const pdfBuffer = await generatePDF(mail);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="mail-${mail.id}.pdf"`,
    );
    res.send(pdfBuffer);

    console.log("PDF exported successfully");
  } catch (error) {
    console.error("PDF EXPORT ERROR:", error.message);
    res
      .status(500)
      .json({ message: "PDF generation failed", error: error.message });
  }
});

module.exports = router;
