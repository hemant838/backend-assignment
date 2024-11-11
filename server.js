import express, { json } from "express";
import connectDB from "./config/database.js";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import userSearchRoutes from "./routes/userSearchRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import passport from "passport";
import cors from "cors";

config();
connectDB();

const app = express();

// Middleware
app.use(json());
app.use(cors());

//Initialised the passport which is required for google 0Auth
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/user-search", userSearchRoutes);
app.use("/api/google", googleAuthRoutes);

// 404 Error Handling
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
