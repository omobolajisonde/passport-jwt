const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    minLength: 2,
    trim: true,
    required: [true, "You need to provide a username?"],
    unique: true,
  },
  password: {
    type: String,
    minLength: 6,
    trim: true,
    required: [true, "You need a password! It's a dangerous world online"],
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
