const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const connectEnsureLogin = require("connect-ensure-login"); // Ensures user still has a valid login session
const session = require("express-session");
const User = require("./models/userModel");

const app = express(); // express app

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Configure the app to use sessions
// Session is a way to store data on the server between requests.
// Since we didn't specify which server store to use, the default MemoryStore is being used.
// so that we can access it on subsequent requests
// in this case, we are storing the authenticated user id for the duration of the session
app.use(
  session({
    name: "bj:sessionId", // by default is "connect.sid", but should be changed if you have multiple apps running on the same domian (localhost)
    secret: process.env.SESSION_SECRET, // used to sign the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

app.use(passport.initialize()); // initialize passport middleware
app.use(passport.session()); // use passport session middleware cause our app uses persistent login sessions
require("./middlewares/passport"); // making app aware of the passport middlewares

app.get("/", async (req, res, next) => {
  return res.status(200).send("Welcome to our app!");
});

app.get(
  "/profile",
  connectEnsureLogin.ensureLoggedIn("/login"),
  async (req, res, next) => {
    return res.status(200).send("Welcome to your profile!");
  }
);

app.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(
        new Error({
          message: "Provide username and password.",
          statusCode: 400,
        })
      );
    }
    const user = await User.create({ username, password });
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureMessage: "Try logging again!",
    })(req, res, next);
    // return res.status(201).json({
    //   success: true,
    //   user,
    // })
  } catch (error) {
    return next(error);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: "Try logging again!",
  }),
  (req, res, next) => {
    console.log(req.user);
    res.redirect(302, "/profile");
  }
);

app.use((err, req, res, next) => {
  return res.json({ err });
});

module.exports = app;
