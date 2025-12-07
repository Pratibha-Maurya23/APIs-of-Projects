import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

/* ✅ CORS (required for cookies) */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend port
    credentials: true,
  })
);

app.use(express.json());

/* ✅ SESSION CONFIG — FIXED */
app.use(
  session({
    name: "admission.sid",
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // ✅ CORRECT
    }),
    cookie: {
      httpOnly: true,
      secure: false, // true in production
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

app.use(authRoutes);


/* ✅ MONGODB CONNECT */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 8000, () =>
      console.log(`✅ Server running on http://localhost:${process.env.PORT || 8000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
