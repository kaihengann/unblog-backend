const { Router } = require("express");
const Ctrl = require("../controllers/userBlog.controller");

const userBlogRouter = Router();

userBlogRouter.get("/", Ctrl.findAllUsers);

module.exports = userBlogRouter