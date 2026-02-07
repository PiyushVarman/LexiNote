import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import readline from "readline";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function searchWord(word) {
  try {
    await client.connect();

    const db = client.db("lexinote");
    const collection = db.collection("words");

    const results = await collection.find({ word }).toArray();

    if (results.length === 0) {
      console.log(`No entries found for "${word}"`);
      return;
    }

    console.log(`\nFound ${results.length} meanings for "${word}":\n`);

    results.forEach((entry, index) => {
      console.log(`Meaning ${index + 1} (${entry.pos}):`);
      console.log(`Definition: ${entry.definition}`);
      console.log(`Synonyms: ${entry.synonyms.join(", ")}`);
      console.log("-----------------------------------");
    });

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    rl.close();
  }
}

rl.question("Enter a word: ", (input) => {
  const word = input.trim().toLowerCase();
  searchWord(word);
});
