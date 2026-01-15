import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
