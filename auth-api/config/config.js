require("dotenv").config();

module.exports.config = {
  port: process.env.PORT || 5000,
  mongoURL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/defaultDB",
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  refreshSecret: process.env.REFRESH_SECRET || "defaultRefreshSecret",
};
