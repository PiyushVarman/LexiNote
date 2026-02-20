import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Backend running at http://localhost:${process.env.PORT}`);
});
