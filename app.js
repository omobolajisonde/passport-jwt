const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // loads .env file into process.env

const app = express(); // express app
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "127.0.0.1";

// Connecting to a mongoDB database
const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;

mongoose.connect(MONGODB_CONNECTION_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});

app.use(express.json());

app.get("/", (req, res, next) => {
  return res.status(200).send("Welcome to our app!");
});

app.listen(PORT, HOST, () => {
  console.log("Server running locally on port " + PORT);
});
