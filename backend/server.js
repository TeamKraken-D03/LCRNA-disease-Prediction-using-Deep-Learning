import express from "express";
import cors from "cors";
import searchRoute from "./routes/search.js";
import relateRoute from "./routes/related.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/search", searchRoute);
app.use("/api/related", relateRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
