const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/userModel");

// Passport serializes user information to the session on successful authentication of user.
passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, {
      id: user.id,
      username: user.username,
    });
  });
});

// Passport deserializes user information from the session on subsequent requests after successful authentication of user.
passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, user); // updates req.user from being the whole user object to the one specified in the serializeUser function
  });
});

// configuring passport's local strategy
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user || !(await user.isCorrectPassword(password))) {
          done(null, null, { message: "Username or password not correct " });
        }
        return done(null, user); // Serializes user into session and sets req.user = user
      } catch (error) {
        console.log("Here");
        return done(error);
      }
    }
  )
);
