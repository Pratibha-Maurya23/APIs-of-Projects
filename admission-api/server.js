import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/auth.js";
import { config } from "./config/config.js";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
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
    app.listen(PORT || 8080, "0.0.0.0", () =>
      console.log(`✅ Server running on ${PORT || 8000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });


