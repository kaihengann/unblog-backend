require("../src/utils/db");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const userBlogsData = require("../data/userBlogsData");

describe("app", () => {
  let connection;
  let db;
  beforeAll(async () => {
    const dbURI = global.__MONGO_URI__;
    connection = await MongoClient.connect(dbURI, {
      useNewUrlParser: true
    });
    const dbName = dbURI.split("/").pop();
    db = await connection.db(dbName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    await db.dropDatabase();
    const UserBlogs = db.collection("userblogs");
    await UserBlogs.insertMany(userBlogsData);
  });

  describe("Routes", () => {
    test("GET / should return all UserBlogs", async () => {
      const response = await request(app).get("/userBlogs");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(userBlogsData);
    });

    test("GET /users/:username should return one user blog", async () => {
      const response = await request(app).get("/userBlogs/users/user1");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(userBlogsData[0]);
    });

    test("GET /posts/:username should return all blogposts of user", async () => {
      const response = await request(app).get("/userBlogs/posts/user1");
      const allPosts = userBlogsData[0].posts;
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(allPosts);
    });

    test("GET /posts should return one blogpost", async () => {
      const response = await request(app)
        .get("/userBlogs/posts")
        .query({ username: "user1" })
        .query({ postId: "postId1" });

      const foundPost = userBlogsData[0].posts[0];
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(foundPost);
    });
    
    test("POST /createUserBlog should create one user blog", async () => {
      const requestBody = {
        username: "user3",
        password: "Password3"
      };

      const expectedObject = {
        username: "user3",
        posts: []
      };

      const response = await request(app)
        .post("/userBlogs/createUserBlog")
        .send(requestBody)
        .set("Content-Type", "application/json");

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(expectedObject);
    });

    test("POST /posts/:username should create post", async () => {
      const requestBody = {
        postTitle: "Post2",
        postBody: "PostBody2"
      };

      const response = await request(app)
        .post("/userBlogs/posts/user1")
        .send(requestBody)
        .set("Content-Type", "application/json");

      const found = await db
        .collection("userblogs")
        .findOne({ username: "user1" });

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(requestBody);
    });

    test("PUT /posts should update one post", async () => {
      const requestBody = { 
        postId: "postId1",
        postTitle: "PostChanged",
        postBody: "PostBodyChanged",
       };

      const response = await request(app)
        .put("/userBlogs/posts/user1")
        .send(requestBody)
        .set("Content-Type", "application/json");

      const updatedUserBlog = await db
        .collection("userblogs")
        .findOne({ username: "user1" });
      const updatedPost = updatedUserBlog.posts[0]

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(requestBody);
      expect(updatedPost).toMatchObject(requestBody);
    });

    test("DELETE /posts/:username should delete one post", async () => {
      const requestBody = { postId: "postId1" };

      const response = await request(app)
        .del("/userBlogs/posts/user1")
        .send(requestBody)
        .set("Content-Type", "application/json");

      const updatedUserBlog = await db
        .collection("userblogs")
        .findOne({ username: "user1" });
      
      expect(response.status).toEqual(200);
      expect(response.body).toEqual("Deleted post with postId: postId1");
      expect(response.body).toEqual("Deleted post with postId: postId1");
      expect(updatedUserBlog.posts).toEqual([]);
    });
  });

  xdescribe("User login/logout", () => {
    let username, password, posts;
    username = "testusername";
    password = "testPassword123";
    posts = [
      {
        title: "myfirstpost",
        body: "somecontentityped"
      }
    ];
    input = { username, password, posts };

    test("user should be able to login and logout", async () => {
      const newUserBlog = await userBlog.createUserBlog(input);
      expect(newUserBlog.username).toEqual(input.username);
    });

    test("user should not be able to login if wrong password", async () => {
      await userBlog.createUserBlog(input);
      input.password = "wrong password";
      const signedInUser = await userBlog.userLogin(input);
      expect(signedInUser).toBeFalsy();
    });

    test("user should stay logged in when jwt token is present", async () => {});
  });
});
