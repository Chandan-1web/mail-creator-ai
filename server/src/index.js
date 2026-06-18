const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const mailRoutes = require("./routes/mail.routes");

app.use("/api/auth", authRoutes);
app.use("/api/mails", mailRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Mail Creator API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
