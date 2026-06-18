const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");

const authRoutes = require("./routes/auth.routes");
const mailRoutes = require("./routes/mail.routes");

const app = express();

const isAllowedDevelopmentOrigin = (origin) => {
  if (env.nodeEnv !== "development") {
    return false;
  }

  return (
    origin?.startsWith("http://localhost:") ||
    origin?.startsWith("http://127.0.0.1:")
  );
};

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      env.clientUrls.includes(origin) ||
      isAllowedDevelopmentOrigin(origin)
    ) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Mail Creator API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Mail Creator API is healthy",
    environment: env.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/mails", mailRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR:", error.message);

  res.status(500).json({
    success: false,
    message:
      env.nodeEnv === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
  });
});

if (process.env.VERCEL !== "1") {
  app.listen(env.port, () => {
    console.log("=================================");
    console.log("Mail Creator API started");
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Port: ${env.port}`);
    console.log(`Health: http://localhost:${env.port}/api/health`);
    console.log("=================================");
  });
}

module.exports = app;
