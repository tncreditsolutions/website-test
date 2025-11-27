const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- SERVE BUILT CLIENT FILES ----
const clientDistPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDistPath));

// Multer for file uploads
const upload = multer();

// ----------- API ROUTE -------------
app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

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
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});

// ---- FALLBACK: SEND CLIENT INDEX.HTML ----
// Needed for Vite/React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
