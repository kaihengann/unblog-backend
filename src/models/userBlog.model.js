const mongoose = require("mongoose");
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

mongoose.model("userBlog", userBlogSchema);
