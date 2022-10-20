const mongoose = require("mongoose");

module.exports = function () {
  // Connecting to a mongoDB database
  const MONGODB_CONNECTION_URI = process.env.MONGODB_CONNECTION_URI;
  mongoose.connect(MONGODB_CONNECTION_URI);
  mongoose.connection.on("connected", async () => {
    console.log("Connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
  });
};
