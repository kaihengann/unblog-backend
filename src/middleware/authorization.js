const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
require("../models/userBlog.model");

const UserBlogModel = mongoose.model("userBlog");

const authorization = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    const verifyToken = token => jwt.verify(token, process.env.JWT_SECRET);
    const _id = verifyToken(token).sub;
    const foundUser = await UserBlogModel.findOne({ _id });
    if (foundUser) {
      next()
    } else {
      return await res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authorization
