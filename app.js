const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/", (req,res) => res.send("Hello World"))
app.use("/userBlog", require("./routes/userBlog.route"));

app.use((err, req, res, next) => {
  console.log('error', err);
  res.sendStatus(500);
});

module.exports = app;