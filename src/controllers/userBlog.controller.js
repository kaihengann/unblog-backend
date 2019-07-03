const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
require("../utils/db");
require("../models/userBlog.model");

const generateToken = user =>
  jwt.sign(
    { sub: user._id, iat: new Date().getTime(), user: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

const UserBlogModel = mongoose.model('userBlog')

const findAllUserBlogs = async (req, res) => {
  try {
    const foundUserBlogs = await UserBlogModel.find();
    res.json(foundUserBlogs);
  } catch (err) {
    const error = new Error("UserBlogs not found");
    res.status(404).json(error.message);
  }
};

const findOneUserBlog = async (req, res) => {
  try {
    const { username } = req.params;
    const foundUserBlog = await UserBlogModel.findOne({ username });
    res.json(foundUserBlog);
  } catch (err) {
    const error = new Error("UserBlog not found");
    res.status(404).json(error.message);
  }
};

const findAllPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const foundUserBlog = await UserBlogModel.findOne({ username });
    return res.json(foundUserBlog.posts);
  } catch (err) {
    const error = new Error("Posts not found");
    res.status(404).json(error.message);
  }
};

const findOnePost = async (req, res) => {
  try {
    const { username, postId } = req.query;
    const foundUserBlog = await UserBlogModel.findOne({ username });
    const posts = foundUserBlog.posts;
    const foundPost = posts.find(post => post.postId === postId);
    return res.json(foundPost);
  } catch (err) {
    const error = new Error("Post not found");
    res.status(404).json(error.message);
  }
};

const isUserLoggedIn = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];
    const verifyToken = token => jwt.verify(token, "mysecret");
    const _id = verifyToken(token).sub;
    const foundUser = db.findOne({ _id });
    if (foundUser) {
      return res.json({ username: foundUser.username });
    }
    res.sendStatus(401);
  } catch (err) {
    next(err);
  }
};

const createUserBlog = async (req, res) => {
  try {
    const { username, password } = req.body;
    const saltRound = 10;
    const hash = await bcrypt.hash(password, saltRound);
    const userInfo = {
      username,
      password: hash
    };
    const newUserBlog = new UserBlogModel(userInfo);
    await newUserBlog.save();
    return res.status(201).json(newUserBlog);
  } catch (err) {
    const error = new Error("UserBlog not created");
    res.status(400).json(error.message);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { postTitle, postBody } = req.body;
    const newPost = {
      postId: uuidv4(),
      postTitle,
      postBody,
      createdOn: Date.now(),
      updatedOn: Date.now()
    };
    const foundUserBlog = await UserBlogModel.findOne({ username });
    const posts = foundUserBlog.posts;
    posts.push(newPost);
    await foundUserBlog.save();
    return await res.status(201).json(newPost);
  } catch (err) {
    const error = new Error("Post not created");
    res.status(400).json(error.message);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { username, postId, postTitle, postBody, createdOn } = req.body;
    const updatedPost = {
      postId,
      postTitle,
      postBody,
      createdOn,
      updatedOn: Date.now()
    };
    const foundUserBlog = await UserBlogModel.findOne({ username });
    const posts = foundUserBlog.posts;
    const postIndex = posts.findIndex(post => post.postId === postId);
    posts.splice(postIndex, 1, updatedPost);

    await foundUserBlog.save();
    res.json(updatedPost);
  } catch (err) {
    const error = new Error("Post not updated");
    res.status(400).json(error.message);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { postId } = req.body;
    const foundUserBlog = await UserBlogModel.findOne({ username });
    const posts = foundUserBlog.posts;
    const postIndex = posts.findIndex(post => post.postId === postId);
    posts.splice(postIndex, 1);
    await foundUserBlog.save();
    return await res.json(`Deleted post with postId:${postId} `);
  } catch (err) {
    const error = new Error("Post not deleted");
    res.status(400).json(error.message);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await UserBlogModel.findOne({ username });
    const isUser = await bcrypt.compare(password, foundUser.password);
    if (isUser) {
      const jwt = generateToken(foundUser);
      return res.json({
        username,
        jwt
      });
    }
    return res.status(401).json("Invalid username/password");
  } catch (err) {
    next(err);
  }
};

// TODO: Add logout logic
const userLogout = async (req, res, next) => {
  try {
    const { username } = req.body;
    return res.status(200).json(`user: ${username} is logged out`);
  } catch (err) {
    const error = new Error("User not logged out");
    res.status(401).json(error.message);
  }
};

module.exports = {
  userLogin,
  userLogout,
  isUserLoggedIn,
  findAllUserBlogs,
  findOneUserBlog,
  findAllPosts,
  findOnePost,
  createUserBlog,
  createPost,
  deletePost,
  updatePost
};
