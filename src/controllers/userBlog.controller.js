require("dotenv").config();
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

const UserBlogModel = mongoose.model("userBlog");

const findAllUserBlogs = async (req, res) => {
  try {
    const foundUserBlogs = await UserBlogModel.find();
    return await res.json(foundUserBlogs);
  } catch (err) {
    const error = new Error("UserBlogs not found");
    return await res.status(404).json(error.message);
  }
};

const findOneUserBlog = async (req, res) => {
  try {
    const { username } = req.params;
    const foundUserBlog = await UserBlogModel.findOne({ username });
    return await res.json(foundUserBlog);
  } catch (err) {
    const error = new Error("UserBlog not found");
    return await res.status(404).json(error.message);
  }
};

const findAllPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const foundUserBlog = await UserBlogModel.findOne({ username });
    return await res.json(foundUserBlog.posts);
  } catch (err) {
    const error = new Error("Posts not found");
    return await res.status(404).json(error.message);
  }
};

const findOnePost = async (req, res) => {
  try {
    const { username, postId } = req.query;
    const foundUserBlog = await UserBlogModel.findOne({ username });
    const posts = foundUserBlog.posts;
    const foundPost = posts.find(post => post.postId === postId);
    return await res.json(foundPost);
  } catch (err) {
    const error = new Error("Post not found");
    return await res.status(404).json(error.message);
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
    return await res.status(201).json(newUserBlog);
  } catch (err) {
    const error = new Error("UserBlog not created");
    return await res.status(400).json(error.message);
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

    const foundUserBlog = await UserBlogModel.findOneAndUpdate(
      { username },
      { $push: { posts: newPost } },
      { new: true }
    );

    return await res.status(201).json(foundUserBlog.posts[0]);
  } catch (err) {
    const error = new Error("Post not created");
    return await res.status(400).json(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { postId, postTitle, postBody, createdOn } = req.body;
    const updatedPost = {
      postId,
      postTitle,
      postBody,
      createdOn,
      updatedOn: Date.now()
    };

    const foundUserBlog = await UserBlogModel.findOneAndUpdate(
      { username, "posts.postId": postId },
      { $set: { "posts.$": updatedPost } },
      { new: true }
    );
    return await res.json(foundUserBlog.posts[0]);
  } catch (err) {
    const error = new Error("Post not updated");
    return await res.status(400).json(error.message);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { postId } = req.body;

    await UserBlogModel.updateOne(
      { username },
      { $pull: { posts: { postId } } },
      { new: true }
    );

    return await res.json(`Deleted post with postId: ${postId}`);
  } catch (err) {
    const error = new Error("Post not deleted");
    return await res.status(400).json(error.message);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await UserBlogModel.findOne({ username });
    const isUser = await bcrypt.compare(password, foundUser.password);

    if (isUser) {
      const jwt = generateToken(foundUser);
      return await res.json({
        username,
        jwt
      });
    }
    return await res.status(401).json("Invalid username/password");
  } catch (err) {
    console.log(err.message);
    
    next(err);
  }
};

// TODO: Add logout logic
const userLogout = async (req, res, next) => {
  try {
    const { username } = req.body;
    return await res.status(200).json(`user: ${username} is logged out`);
  } catch (err) {
    const error = new Error("User not logged out");
    return await res.status(401).json(error.message);
  }
};

const userLoggedIn = async (req, res, next) => {
  try {
    return await res.json({ username: req.params.username });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userLogin,
  userLogout,
  userLoggedIn,
  findAllUserBlogs,
  findOneUserBlog,
  findAllPosts,
  findOnePost,
  createUserBlog,
  createPost,
  deletePost,
  updatePost
};
