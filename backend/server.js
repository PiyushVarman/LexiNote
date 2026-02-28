import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mammoth from "mammoth";
import fs from "fs";
import HTMLtoDOCX from "html-to-docx";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  pos: String,
  definition: String,
  synonyms: [String],
  source: String,
  createdAt: { type: Date, default: Date.now },
});

const upload = multer({ dest: "uploads/" });

const Word = mongoose.model("Word", wordSchema, "words");


app.get("/word/:word", async (req, res) => {
  try {
    const searchWord = req.params.word;

    const results = await Word.find({
      word: { $regex: new RegExp("^" + searchWord + "$", "i") }
    });

    if (!results.length) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(results);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/random", async (req, res) => {
  try {
    const randomWord = await Word.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (!randomWord.length) {
      return res.status(404).json({ message: "No words found" });
    }

    res.json(randomWord);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await mammoth.convertToHtml(
      { path: req.file.path },
      { includeDefaultStyleMap: true }
    );

    fs.unlinkSync(req.file.path);

    res.json({ content: result.value });

  } catch (error) {
    res.status(500).json({ message: "File conversion failed" });
  }
});


import puppeteer from "puppeteer";

app.post("/save", async (req, res) => {
  try {
    const html = req.body.content;

    if (!html) {
      return res.status(400).json({ message: "Empty document" });
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=LexiNote.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF generation failed" });
  }
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Backend running at http://localhost:${process.env.PORT}`);
});
