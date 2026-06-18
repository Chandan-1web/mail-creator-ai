const PDFDocument = require("pdfkit");

const generatePDF = (mail) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Title
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("OFFICIAL CORRESPONDENCE", { align: "center" });
      doc.moveDown(0.5);

      // Line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // Content
      doc.fontSize(11).font("Helvetica");

      // Date
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.text(`To: ${mail.recipientName}`);
      doc.text(`Designation: ${mail.recipientRole}`);
      doc.moveDown(0.5);

      // Subject
      doc.text(`Subject: ${mail.subject}`);
      doc.moveDown(1);

      // Body
      doc.text(mail.generatedBody, { lineGap: 6 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };
