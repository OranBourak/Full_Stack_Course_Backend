import request from "supertest";
import appInit from '../Server';
import mongoose from 'mongoose';
import Post from '../models/post_model';
import User from '../models/user_model';
import { Express } from "express";

let app:Express;

const testUser = {
    email: "testPost@gmail.com",
    password: "12345678",
    accessToken: null
}

beforeAll(async ()=>{
    app = await appInit();
    console.log("beforeAll");
    await Post.deleteMany();
    await User.deleteMany({ email: testUser.email });
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
})


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});


describe("Post test",()=>{

    test("Get /post - empty collection", async ()=>{
        const res = await request(app).get("/post");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]); 
    });

    const post = {
        title: "test post title",
        message: "test post message",
        owner: "Oran"
    }

    test("Post /post - empty collection", async ()=>{
        const res =  await request(app).post("/post")
        .set('Authorization', 'Bearer ' + testUser.accessToken)
        .send(post);
        expect(res.statusCode).toBe(201);
    });
  
});
