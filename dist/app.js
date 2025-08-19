import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import { notFound, errorHandler } from "./middleware/error.js";
export const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// Allow all origins
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 100 }));
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use(notFound);
app.use(errorHandler);
export async function connectDB() {
    await mongoose.connect(env.MONGODB_URI);
}
