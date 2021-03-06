const mongoose = require("mongoose");

const mongoOptions = {
  useNewUrlParser: true
};

const dbUrl =
  process.env.MONGODB_URI ||
  global.__MONGO_URI__ ||
  "mongodb://localhost:27017/unblog";
mongoose.connect(dbUrl, mongoOptions);
const db = mongoose.connection;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const currentEnv = process.env.NODE_ENV || "development";
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`connected to ${currentEnv} mongodb `);
});
