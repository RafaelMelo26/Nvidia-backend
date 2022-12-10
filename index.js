const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./controller/router");
const mongoose = require("mongoose");

dotenv.config();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/", router);

mongoose.connect(
  `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.rruvhkl.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Port: ${port}`);
});
