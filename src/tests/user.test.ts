import request from "supertest";
import appInit from "../Server";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;

const testUser = {
  email: "testUser@gmail.com",
  password: "12345678",
  imgUrl: "testPost.jpg",
  accessToken: null,
};

beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await User.deleteMany({ email: testUser.email });
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = res.body.accessToken;
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});

describe("User test", () => {
  test("Get /user ", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", "Bearer " + testUser.accessToken);
    expect(res.statusCode).toBe(200);
  });

  test("should respond with the user data for a valid email", async () => {
    const response = await request(app)
      .get(`/user/email/${testUser.email}`)
      .set("Authorization", `Bearer ${testUser.accessToken}`); // Set the authorization header

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toEqual(testUser.email);
    expect(response.body.imgUrl).toEqual(testUser.imgUrl);
  });

  test("should respond with a 404 status if the user does not exist", async () => {
    const response = await request(app)
      .get("/user/email/nonexistentuser@example.com")
      .set("Authorization", `Bearer ${testUser.accessToken}`); // Set the authorization header

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("User not found");
  });

  test("Get following list", async () => {
    const res = await request(app)
      .get("/user/following")
      .set("Authorization", `Bearer ${testUser.accessToken}`);
    expect(res.statusCode).toBe(400);
  });
});
