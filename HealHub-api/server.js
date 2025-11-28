const express = require('express');
const mongoose = require('mongoose');
const { authRouter } = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const {config} = require("./config/config");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mediRouter = require("./routes/medicineRouter");

const app = express();

app.use(cors({
  origin: ["http://localhost:5174","http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options(/.*/, cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/medicine", mediRouter);


const PORT = config.port;
const MONGO_URL = config.mongoURL;

mongoose.connect(MONGO_URL)
.then(()=>{
  console.log("DB Connected ");
app.listen(PORT,"0.0.0.0",()=>console.log(`Server running at ${PORT}`));

})
.catch((err)=>console.log(err));

