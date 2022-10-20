const dotenv = require("dotenv");

dotenv.config(); // loads .env file into process.env

const app = require("./app");
const dbConnect = require("./config/db");
dbConnect(); // connects to a mongoDB database
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log("Server running locally on port " + PORT);
});
