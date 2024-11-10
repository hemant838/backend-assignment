import express, { json } from "express";
import connectDB from "./config/database.js";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import userSearchRoutes from "./routes/userSearchRoutes.js";
import cors from "cors";

config();
connectDB();

const app = express();

// Middleware
app.use(json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/user-search", userSearchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
