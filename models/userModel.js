const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

userSchema.pre("save", async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

userSchema.methods.isPasswordCorrect = async function (inputPassword) {
  const isCorrect = await bcrypt.compare(inputPassword, this.password);
  return isCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
