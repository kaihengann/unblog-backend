const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const userBlog = require("../src/controllers/userBlog.controller");

let connection;
let db;
let UserBlogs;

beforeAll(async () => {
  connection = await MongoClient.connect(global.__MONGO_URI__, {
    useNewUrlParser: true
  });
  db = await connection.db(global.__MONGO_DB_NAME__);
});

afterAll(async () => {
  mongoose.connection.close();
  await connection.close();
});

beforeEach(() => {
  db.dropDatabase();
  UserBlogs = db.collection("userblogs");
});

describe("User account", () => {
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
    const newUserBlog = await userBlog.userSignUp(input);
    expect(newUserBlog.username).toEqual(input.username);
  });

  test("user should not be able to login if wrong password", async () => {
    await userBlog.userSignUp(input);
    input.password = "wrong password";
    const signedInUser = await userBlog.userLogin(input);
    expect(signedInUser).toBeFalsy();
  });
});
