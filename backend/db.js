import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL);

export async function connectDB() {
  await client.connect();
  return client.db("bio"); 
}
