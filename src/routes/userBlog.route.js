const { Router } = require("express");
const Ctrl = require("../controllers/userBlog.controller");

const userBlogRouter = Router();

userBlogRouter.get("/", Ctrl.findAllUserBlogs);
userBlogRouter.get("/users/:username", Ctrl.findOneUserBlog);
userBlogRouter.get("/posts/:username", Ctrl.findAllPosts);
userBlogRouter.get("/posts", Ctrl.findOnePost);
userBlogRouter.post("/createUserBlog", Ctrl.createUserBlog);
userBlogRouter.post("/posts/:username", Ctrl.createPost);
userBlogRouter.put("/posts/:username", Ctrl.updatePost);
userBlogRouter.delete("/posts/:username", Ctrl.deletePost);

userBlogRouter.post("/login", Ctrl.userLogin);
userBlogRouter.post("/logout", Ctrl.userLogout);
userBlogRouter.get("/secure", Ctrl.isUserLoggedIn);
module.exports = userBlogRouter;
