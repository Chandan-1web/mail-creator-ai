require("dotenv").config();

const parseUrlList = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  groqApiKey: process.env.GROQ_API_KEY,
  clientUrls: parseUrlList(
    process.env.CLIENT_URLS ||
      "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174",
  ),
};

process.env.JWT_EXPIRES_IN = env.jwtExpiresIn;

const missingVariables = [];

if (!env.databaseUrl) {
  missingVariables.push("DATABASE_URL");
}

if (!env.jwtSecret) {
  missingVariables.push("JWT_SECRET");
}

if (!env.groqApiKey) {
  missingVariables.push("GROQ_API_KEY");
}

if (missingVariables.length > 0) {
  console.error("Missing required environment variables:");
  missingVariables.forEach((variable) => console.error(`- ${variable}`));
  process.exit(1);
}

if (env.jwtSecret.length < 32) {
  console.warn(
    "Warning: JWT_SECRET should be at least 32 characters long for production.",
  );
}

module.exports = { env };
