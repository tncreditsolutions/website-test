// server/index.js (robust static serving)
const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
const upload = multer();

// Candidate build locations (check in order)
const candidatePaths = [
  path.join(process.cwd(), "client", "dist"), // preferred
  path.join(process.cwd(), "dist"),            // alternate
  path.join(process.cwd(), "client", "build"), // sometimes used
  path.join(process.cwd(), "build")            // fallback
];

let staticPath = null;
for (const p of candidatePaths) {
  try {
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
      staticPath = p;
      break;
    }
  } catch (e) {
    // ignore
  }
}

if (staticPath) {
  console.log("Serving static files from:", staticPath);
  app.use(express.static(staticPath));
} else {
  console.warn("No static build folder found. Expected one of:", candidatePaths);
}

// API route
app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdfText = await pdfParse(req.file.buffer).then((d) => d.text);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Extract key credit report info and return JSON summary. Text: ${pdfText}`;

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ summary: completion.choices[0].message });
  } catch (e) {
    console.error("API error:", e);
    res.status(500).json({ error: e.toString() });
  }
});

// SPA fallback - only if a static path is available
app.get("*", (req, res) => {
  if (staticPath) {
    return res.sendFile(path.join(staticPath, "index.html"));
  }
  res.status(404).send("No frontend build found. Check server logs.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});

