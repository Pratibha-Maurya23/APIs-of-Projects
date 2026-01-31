import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  mongoURL: process.env.MONGO_URL || "mongodb+srv://root:shri@cluster0.56811wo.mongodb.net/admissionDB?retryWrites=true&w=majority&appName=Cluster0",
  sessionSecret: process.env.SESSION_SECRET || "supersecret123",
  twilidSid:process.env.TWILIO_SID|| "",
  twilidAuth:process.env.TWILIO_AUTH|| "",
  twilidPhone:process.env.TWILIO_PHONE|| ""
};