// -------------------------------
// server/index.js
// -------------------------------
import express from "express";
import multer from "multer";
import cors from "cors";
import pdfParse from "pdf-parse";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// ----------------------
// STATIC CLIENT BUILD
// ----------------------
const clientDistPath = path.join(__dirname, "../client/dist");

// Serve static files
app.use(express.static(clientDistPath));

// ----------------------
// PDF UPLOAD & ANALYSIS
// ----------------------
const upload = multer();

app.post("/api/analyze", upload.single("file"), asy
