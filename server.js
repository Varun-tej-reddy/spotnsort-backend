import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import reportsRouter from "./routes/reports.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/reports", reportsRouter);
app.use("/api/auth", authRouter);

// Root test
app.get("/", (req, res) => {
  res.send("✅ Backend running successfully");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));