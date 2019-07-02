const express = require("express");
const app = express();
const cors = require("cors");
const userBlogRouter = require('./src/routes/userBlog.route')

app.use(cors());
app.use(express.json());

app.use("/", (req,res) => res.send("Hello World"))
app.use("/userBlog", userBlogRouter);

app.use((err, req, res, next) => {
  console.log('error', err);
  res.sendStatus(500);
});

module.exports = app;