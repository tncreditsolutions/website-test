const path = require("path");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());

// Correct absolute build path for Railway & local use
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));

const upload = multer();

app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

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

// fallback for React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port", process.env.PORT || 3000)
);
