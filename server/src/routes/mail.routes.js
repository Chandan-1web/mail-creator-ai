const express = require("express");
const { body, param } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
const validateRequest = require("../middleware/validateRequest.middleware");
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

const mailIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Mail ID is required")
    .isLength({ min: 8, max: 80 })
    .withMessage("Invalid mail ID"),
];

const createMailValidation = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 3, max: 160 })
    .withMessage("Subject must be between 3 and 160 characters"),

  body("recipientName")
    .trim()
    .notEmpty()
    .withMessage("Recipient name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Recipient name must be between 2 and 100 characters"),

  body("recipientRole")
    .trim()
    .notEmpty()
    .withMessage("Recipient role is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Recipient role must be between 2 and 100 characters"),

  body("senderRole")
    .trim()
    .notEmpty()
    .withMessage("Your role is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Your role must be between 2 and 100 characters"),

  body("tone")
    .trim()
    .notEmpty()
    .withMessage("Tone is required")
    .isIn(["formal", "semi-formal", "polite"])
    .withMessage("Tone must be formal, semi-formal, or polite"),

  body("keyPoints")
    .trim()
    .notEmpty()
    .withMessage("Key points are required")
    .isLength({ min: 10, max: 2500 })
    .withMessage("Key points must be between 10 and 2500 characters"),
];

router.post(
  "/",
  authMiddleware,
  createMailValidation,
  validateRequest,
  createMail,
);

router.get("/", authMiddleware, getMails);

router.get("/:id", authMiddleware, mailIdValidation, validateRequest, getMail);

router.delete(
  "/:id",
  authMiddleware,
  mailIdValidation,
  validateRequest,
  deleteMail,
);

router.post(
  "/:id/regenerate",
  authMiddleware,
  mailIdValidation,
  validateRequest,
  async (req, res) => {
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
  },
);

router.get(
  "/:id/export/pdf",
  authMiddleware,
  mailIdValidation,
  validateRequest,
  async (req, res) => {
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
  },
);

module.exports = router;
