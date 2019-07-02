const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

const postSchema = new Schema({
  title: { type: String },
  body: { type: String },
  createOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});

const userBlogSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  },
  posts: [{ postSchema }],
  salt: String
});

module.exports = mongoose.model("userBlog", userBlogSchema);
