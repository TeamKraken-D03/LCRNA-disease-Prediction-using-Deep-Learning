import express from "express";
import { connectDB } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { disease, lncrna } = req.query;
    
    const db = await connectDB();
    const collection = db.collection("project");
    
    const query1 = {};
    if (disease) query1.DiseaseName = disease;
    const query2 = {};
    if (lncrna) query2.ncRNASymbol = lncrna;
    
    try {
        const associated_lncrna = await collection.find(query1).toArray();
        const associated_diseases = await collection.find(query2).toArray();
        res.json({ associated_lncrna, associated_diseases });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
