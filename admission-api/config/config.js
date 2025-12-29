import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoURL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/defaultDB",
  sessionSecret: process.env.SESSION_SECRET || "defaultSecret",
  twilidSid:process.env.TWILIO_SID|| "",
  twilidAuth:process.env.TWILIO_AUTH|| "",
  twilidPhone:process.env.TWILIO_PHONE|| ""
};