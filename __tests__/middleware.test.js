require("../src/utils/db");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const userBlogsData = require("../data/userBlogsData");
const userBlog = require("../src/controllers/userBlog.controller");
const bcrypt = require("bcrypt")
const authentication = require('../src/middleware/authorisation')

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

  describe('Middleware', () => {
    xtest(' ', () => {
      
    });
  });
