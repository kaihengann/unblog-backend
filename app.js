const express = require("express");
const app = express();
const cors = require("cors");
const userBlogRouter = require("./src/routes/userBlog.route");

app.use(cors());
app.use(express.json());

app.use("/userBlogs", userBlogRouter);

app.use((err, req, res, next) => {
  if (err.status) {
    res.send(`error`, res.body);
  } else {
    console.log("error", err);
    res.sendStatus(500);
  }
});

module.exports = app;
