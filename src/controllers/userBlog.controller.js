const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("../utils/db");
require("../models/userBlog.model");

const UserBlogModel = mongoose.model("userBlog");

const findAllUsers = async (req, res) => {
  const UserBlogs = db.getCollection("test");
  // const testSchema = mongoose.model('test', new Schema({ name: String }))
  const foundUsers = await UserBlogs.find();
  res.json(foundUsers);
};


const userSignUp = async input => {
  const { username, password } = input;
  const saltRound = 10;
  const hash = await bcrypt.hash(password, saltRound);
  userWithHash = {
    username: username,
    password: hash
  };
  const newUserBlog = new UserBlogModel(userWithHash);
  return await newUserBlog.save();
};

const userLogin = async input => {
  const { username, password } = input;
  const foundUser = await UserBlogModel.findOne({ username });
  const isUser = await bcrypt.compare(password, foundUser.password);
  if (isUser) return { username };
  else return isUser;
};

module.exports = { userSignUp, userLogin, findAllUsers };
