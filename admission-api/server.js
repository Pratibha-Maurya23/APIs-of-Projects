import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/auth.js";
import { config } from "./config/config.js";

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection:", reason.message || reason);
});

process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception:", err.message || err);
});

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map(o => o.trim()) : [])
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());


const PORT = config.port;
const MONGO_URL = config.mongoURL;
const SESSION_SECRET = config.sessionSecret;

app.use(
  session({
    name: "admission.sid",
    secret: SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URL, 
    }),
    cookie: {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",// 1 hour
    },
  })
);

app.use(authRoutes);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

app.listen(PORT || 8080, "0.0.0.0", () =>
  console.log(`✅ Server running on ${PORT || 8080}`)
);


