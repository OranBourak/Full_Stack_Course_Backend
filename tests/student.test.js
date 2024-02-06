const request = require("supertest");
const app = require('../App');

const mongoose = require('mongoose');

beforeAll((done)=>{
    console.log("beforeAll");
    done();
});


afterAll(async ()=>{
    await mongoose.connection.close();
    console.log("afterAll");
});


describe("Student test",()=>{

    test("Test Student get all", async ()=>{
        console.log("Test Student get all");
        const res = await request(app).get("/student"); 
        expect(res.statusCode).toBe(200);
    });

});