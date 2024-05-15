import request from "supertest";
import appInit from "../Server";
import mongoose from "mongoose";
import Post from "../models/post_model";
import User from "../models/user_model";
import { Express } from "express";

let app: Express;

const testUser = {
  email: "testPost@gmail.com",
  password: "12345678",
  image: "testPost.jpg",
  accessToken: null,
};

beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await Post.deleteMany();
  await User.deleteMany({ email: testUser.email });
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = res.body.accessToken;
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("Post test", () => {
  test("Get /post - empty collection", async () => {
    const res = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    expect(data).toEqual([]);
  });

  const post = {
    title: "test post title",
    message: "test post message",
    owner: "Oran",
  };

  test("Post /post - empty collection", async () => {
    const res = await request(app)
      .post("/post")
      .set("Authorization", "Bearer " + testUser.accessToken)
      .send(post);
    expect(res.statusCode).toBe(201);
  });

  test("Get /post - posted post", async () => {
    const res = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    expect(data.length).toBe(1);
    expect(data[0].title).toBe(post.title);
    expect(data[0].message).toBe(post.message);
  });

  test("Get /post:id - get post by ID ", async () => {
    const res = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    expect(data.length).toBe(1);
    const ID = data[0]._id;
    const res2 = await request(app)
      .get("/post/" + ID)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res2.statusCode).toBe(200);
  });

  test("Put /post:id - update post by ID ", async () => {
    const res = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    const ID = data[0]._id;
    const updatedPost = {
      title: "updated title",
      message: "updated message",
    };
    const res2 = await request(app)
      .put("/post/" + ID)
      .set("Authorization", "Bearer " + testUser.accessToken)
      .send(updatedPost);
    expect(res2.statusCode).toBe(200);
    const res3 = await request(app)
      .get("/post/" + ID)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res3.statusCode).toBe(200);
    expect(res3.body.title).toBe(updatedPost.title);
  });

  test("Delete /post:id - delete post by ID ", async () => {
    const res = await request(app)
      .get("/post")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    const ID = data[0]._id;
    const res2 = await request(app)
      .delete("/post/" + ID)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res2.statusCode).toBe(200);
    const res3 = await request(app)
      .get("/post/" + ID)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res3.statusCode).toBe(404);
  });
});
