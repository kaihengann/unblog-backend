const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

const userBlogSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true
  },
  posts: [
    {
      postId: { type: String },
      postTitle: { type: String },
      postBody: { type: String },
      createdOn: { type: Date, default: Date.now },
      updatedOn: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("userBlog", userBlogSchema);
