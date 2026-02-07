import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import readline from "readline";
import wordnet from "wordnet-db";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Path to WordNet dict folder
const WORDNET_DICT = wordnet.path;


const DATA_FILES = [
  { file: "data.noun", pos: "n" },
  { file: "data.verb", pos: "v" },
  { file: "data.adj", pos: "a" },
  { file: "data.adv", pos: "r" }
];

async function parseFile(fileName, pos, collection, counter) {
  const filePath = path.join(WORDNET_DICT, fileName);

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.startsWith("  ")) continue;

    const parts = line.split("|");
    if (parts.length < 2) continue;

    const definition = parts[1].trim();
    const data = parts[0].trim().split(/\s+/);

    const wordCount = parseInt(data[3], 16);
    const synonyms = [];

    let index = 4;
    for (let i = 0; i < wordCount; i++) {
      synonyms.push(data[index]);
      index += 2;
    }

    for (const word of synonyms) {
      await collection.insertOne({
        word,
        pos,
        definition,
        synonyms,
        source: "wordnet"
      });

      counter.count++;

      if (counter.count % 1000 === 0) {
        console.log(`Inserted ${counter.count} entries`);
      }
    }
  }
}

async function dumpWordNet() {
  const counter = { count: 0 };

  try {
    await client.connect();
    console.log("Connected to database");
    console.log("START: WordNet to MongoDB database");

    const db = client.db("lexinote");
    const collection = db.collection("words");

    for (const { file, pos } of DATA_FILES) {
      await parseFile(file, pos, collection, counter);
    }

    console.log("SUCCESS: Process Completed");
    console.log(`Total Words: ${counter.count}`);

  } catch (err) {
    console.error("Error Occurred", err);
  } finally {
    await client.close();
    console.log("END: Connection with database terminated");
  }
}

dumpWordNet();
