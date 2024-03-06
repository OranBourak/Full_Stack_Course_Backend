import request from "supertest";
import appInit from '../Server';
import mongoose from 'mongoose';
import Student from '../models/student_model';
import { Express } from "express";
import User from "../models/user_model";

let app:Express;

const testUser = {
    email: "testStudent@gmail.com",
    password: "1234567",
    accessToken: ""
}

beforeAll(async ()=>{
  app = await appInit();
  console.log("beforeAll");
  await Student.deleteMany();
  await User.deleteMany({ email: testUser.email });
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = res.body.accessToken;
})


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});

const students = [
    {
      name: "Oran Bourak",
      _id: "12345",
      age: 22,
    },
    {
      name: "Tomer Burman",
      _id: "12346",
      age: 23,
    },
  ];


describe("Student test",()=>{

    test("Get /student - empty collection", async ()=>{
        const res = await request(app).get("/student").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]); 
    });

   test("POST /student", async () => {
    const res = await request(app).post("/student").send(students[0]).set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual(students[0].name);
    // studentId = res.body._id; // Save the ID for later tests

    // retrieve the student from the database and compare the data to the original
    const res2 = await request(app).get("/student").set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res2.statusCode).toBe(200);
    const data = res2.body;
    const { name, age, _id } = data[0];
    const simplifiedObject = { name, age, _id };
    expect(simplifiedObject).toEqual(students[0]);
  });
   
  test("GET /student/:id", async () => {
    const res = await request(app).get("/student/" + students[0]._id).set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(students[0].name);
    expect(res.body._id).toBe(students[0]._id);
    expect(res.body.age).toBe(students[0].age);
  });

  test("Fail GET /student/:id", async () => {
    const res = await request(app).get("/student/00000").set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toBe(404);
  });

  //test delete student by id
  test("DELETE /student/:id", async () => {
    const res = await request(app).delete("/student/" + students[0]._id).set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).get("/student/" + students[0]._id).set('Authorization', 'Bearer ' + testUser.accessToken);
    expect(res2.statusCode).toBe(404);
  });
  
});