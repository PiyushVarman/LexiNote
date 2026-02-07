import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    // connect
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // select DB and collection
    const db = client.db("lexinote");
    const collection = db.collection("test_words");

    // insert one document
    await collection.insertOne({
      word: "hello",
      definition: "a greeting",
      source: "test"
    });

    console.log("✅ Document inserted");

    // retrieve all documents
    const docs = await collection.find({}).toArray();
    console.log("📦 Documents in collection:");
    console.log(docs);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
