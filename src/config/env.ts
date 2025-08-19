import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
  OMDB_API_KEY: process.env.OMDB_API_KEY || "",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000"
};

if (!env.MONGODB_URI) throw new Error("MONGODB_URI missing");
if (!env.JWT_SECRET) throw new Error("JWT_SECRET missing");
if (!env.OMDB_API_KEY) console.warn("Warning: OMDB_API_KEY missing; /movies/search will fail.");
