import request from "supertest";
import appInit from "../Server";
import mongoose from "mongoose";
import Item from "../models/item_model";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;

const testUser = {
  email: "testStudent@gmail.com",
  password: "1234567",
  image: "testStudent.jpg",
  accessToken: "",
};

beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await User.deleteMany({ email: testUser.email });
  await Item.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = res.body.accessToken;
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

const testPost = {
  name: "test item",
  owner: "Oran Bourak",
};

describe("Item test", () => {
  test("Get /item - empty collection", async () => {
    const res = await request(app)
      .get("/item")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    const data = res.body;
    expect(data).toEqual([]);
  });

  test("POST /item", async () => {
    const res = await request(app)
      .post("/item")
      .send(testPost)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual(testPost.name);
    const res2 = await request(app)
      .get("/item")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body[0].name).toEqual(testPost.name);
    expect(res2.body[0].owner).toEqual(testPost.owner);
  });

  test("GET /item/:id", async () => {
    const res = await request(app)
      .get("/item")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toEqual(200);
    const data = res.body;
    expect(data.length).toBe(1);
    const id = data[0]._id;
    const res2 = await request(app)
      .get("/item/" + id)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.name).toEqual(testPost.name);
    expect(res2.body.owner).toEqual(testPost.owner);
  });

  test("PUT /item/:id - update item by ID", async () => {
    const res = await request(app)
      .get("/item")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toEqual(200);
    const data = res.body;
    expect(data.length).toBe(1);
    const id = data[0]._id;
    const updatedPost = {
      name: "updated name",
      owner: "updated owner",
    };
    const res2 = await request(app)
      .put("/item/" + id)
      .send(updatedPost)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res2.statusCode).toEqual(200);
    const res3 = await request(app)
      .get("/item/" + id)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res3.statusCode).toEqual(200);
    expect(res3.body.name).toEqual(updatedPost.name);
    expect(res3.body.owner).toEqual(updatedPost.owner);
  });

  test("Fail GET /item/:id - get item using fake ID", async () => {
    const res = await request(app)
      .get("/item")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toEqual(200);
    const data = res.body;
    const id = data[0]._id;
    const fakeID = id.slice(0, -4) + "1111";
    const res1 = await request(app)
      .get("/item/" + fakeID)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res1.statusCode).toBe(404);
  });

  test("DELETE /item/:id - delete item by ID", async () => {
    const res = await request(app)
      .get("/item")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toEqual(200);
    const data = res.body;
    const id = data[0]._id;
    const res2 = await request(app)
      .delete("/item/" + id)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res2.statusCode).toEqual(200);
    const res3 = await request(app)
      .get("/item/" + id)
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res3.statusCode).toEqual(404);
  });
});
