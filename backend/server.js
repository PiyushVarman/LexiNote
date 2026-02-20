import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

// Schema (matches your existing DB structure)
const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  pos: String,
  definition: String,
  synonyms: [String],
  source: String,
  createdAt: { type: Date, default: Date.now },
});

// Explicitly using "words" collection
const Word = mongoose.model("Word", wordSchema, "words");

console.log(process.env.MONGO_URI);
console.log(process.env.PORT);

// GET Word Route
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

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Backend running at http://localhost:${process.env.PORT}`);
});
