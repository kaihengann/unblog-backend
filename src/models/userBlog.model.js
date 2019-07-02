const mongoose = require("mongoose");

const postSchema = new Schema({
  title: { type: String },
  body: { type: String },
  createOn: new Date(),
  updatedOn: new Date()
})

const userBlogSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'postSchema'}],
  salt: String
});


module.exports = mongoose.model = ("User", userBlogSchema);
