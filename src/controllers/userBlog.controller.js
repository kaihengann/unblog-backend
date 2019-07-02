const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("../utils/db");
require("../controllers/user.model");

const UserModel = mongoose.model("User");

const signUp = async input => {
  const { username, password } = input;
  const saltRound = 10;
  const hash = await bcrypt.hash(password, saltRound);
  userWithHash = {
    username: username,
    password: hash
  };
  const newUser = new UserModel(userWithHash);
  return await newUser.save();
};

const login = async input => {
  const { username, password } = input;
  const foundUser = await UserModel.findOne({ username });
  const isUser = await bcrypt.compare(password, foundUser.password);
  if (isUser) return { username };
  else return isUser;
};
