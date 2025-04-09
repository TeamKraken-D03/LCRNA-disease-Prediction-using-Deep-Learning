import express from "express";
import { connectDB } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { disease, lncrna } = req.query;

  const db = await connectDB();
  const collection = db.collection("project");

  const query = {};
  if (disease) query.DiseaseName = disease;
  if (lncrna) query.ncRNASymbol = lncrna;

  try {
    const results = await collection.find(query).toArray();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
