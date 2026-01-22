import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import smileRoutes from "./routes/smileRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/smile", smileRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ message: "Server error", error: err.message });
});

//testing
// console.log("EMAIL:", process.env.MY_EMAIL);
// console.log("EMAIL:", process.env.MY_EMAIL);
// console.log("PASS:", process.env.MY_EMAIL_PASS ? "LOADED" : "NOT LOADED");



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

