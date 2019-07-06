const { Router } = require("express");
const Ctrl = require("../controllers/userBlog.controller");
const authorization = require("../middleware/authorization")

const userBlogRouter = Router();

userBlogRouter.get("/", Ctrl.findAllUserBlogs);
userBlogRouter.get("/users/:username", Ctrl.findOneUserBlog);
userBlogRouter.get("/posts/:username", authorization, Ctrl.findAllPosts);
userBlogRouter.get("/posts", authorization, Ctrl.findOnePost);
userBlogRouter.post("/createUserBlog", Ctrl.createUserBlog);
userBlogRouter.post("/posts/:username", authorization, Ctrl.createPost);
userBlogRouter.put("/posts/:username", authorization, Ctrl.updatePost);
userBlogRouter.delete("/posts/:username", authorization, Ctrl.deletePost);

userBlogRouter.post("/login", Ctrl.userLogin);
userBlogRouter.post("/logout", Ctrl.userLogout);
userBlogRouter.get("/secure/:username", Ctrl.userLoggedIn);

module.exports = userBlogRouter;
