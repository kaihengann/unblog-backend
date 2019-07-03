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
      expect(response.body).toMatchObject(userBlogsData);
    });

    test("GET /users/:username should return one user blog", async () => {
      const response = await request(app).get("/userBlogs/users/user1");

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(userBlogsData[0]);
    });
    test("GET /posts/:username should return all blogposts of user", async () => {});
    test("GET /posts should return one blogpost", async () => {});
    test("POST /createUserBlog should create one user blog", async () => {});
    test("POST /posts/:username should create post", async () => {});
    test("PUT /posts should update one post", async () => {});
    test("DELETE /posts/:username should delete one post", async () => {});
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
