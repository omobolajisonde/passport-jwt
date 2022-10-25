const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("./models/userModel");

const app = express(); // express app

app.use(express.urlencoded({ extended: false })); // parses urlencoded body to JavaScript Obj
app.use(express.json()); // parses JSON body to JavaScript Obj

// Initialize passport
app.use(passport.initialize());
require("./middlewares/passport");

app.get("/", async (req, res, next) => {
  return res.status(200).send("Welcome to our app!");
});

app.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    return res.status(200).json({
      user: req.user,
    });
  }
);

app.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  // Hashing before storing in DB
  const user = await User.create({ username, password });
  user.password = undefined; // just so that it doesn't stay in our payload
  const payload = { user };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10h",
    algorithm: "HS256",
  });
  return res.status(201).json({
    user: user,
    token,
  });
});

app.post("/signin", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return next(new Error("User does not exist!"));
  }
  const isCorrectPassword = await user.isCorrectPassword(password);
  if (!isCorrectPassword) {
    return next(new Error("Incorrect password!"));
  }
  user.password = undefined; // just so that it doesn't stay in our payload
  const payload = { user };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 10,
    algorithm: "HS256",
  });
  return res.status(200).json({
    user: user,
    token,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error!";
  return res.status(statusCode).json({ success: false, message });
});

module.exports = app;
