import express from "express";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

client.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
});

const db = client.db("LCRNA");
const collection = db.collection("items");
console.log("Connected to MongoDB");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the LCRNA Search Engine");
});

app.get("/data", async (req, res) => {
  const query = {Species: "Homo sapiens"};
  const response = await collection.findOne(query);
  res.json(response);
});
