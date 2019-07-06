const { Router } = require("express");
const Ctrl = require("../controllers/userBlog.controller");
const authorisation = require("../middleware/authorisation")

const userBlogRouter = Router();

userBlogRouter.get("/", Ctrl.findAllUserBlogs);
userBlogRouter.get("/users/:username", Ctrl.findOneUserBlog);
userBlogRouter.get("/posts/:username", authorisation, Ctrl.findAllPosts);
userBlogRouter.get("/posts", authorisation, Ctrl.findOnePost);
userBlogRouter.post("/createUserBlog", Ctrl.createUserBlog);
userBlogRouter.post("/posts/:username", authorisation, Ctrl.createPost);
userBlogRouter.put("/posts/:username", authorisation, Ctrl.updatePost);
userBlogRouter.delete("/posts/:username", authorisation, Ctrl.deletePost);

userBlogRouter.post("/login", Ctrl.userLogin);
userBlogRouter.post("/logout", Ctrl.userLogout);
userBlogRouter.get("/secure/:username", authorisation, Ctrl.userLoggedIn);

module.exports = userBlogRouter;
