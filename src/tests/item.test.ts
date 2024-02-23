import request from "supertest";
import appInit from '../Server';
import mongoose from 'mongoose';
import Item from '../models/item_model';
import { Express } from "express";

let app:Express;

beforeAll(async ()=>{
    app = await appInit();
    console.log("beforeAll");
    await Item.deleteMany();
})


afterAll(async ()=>{
    console.log("afterAll");
    await mongoose.connection.close();
});


describe("Item test",()=>{

    test("Get /item - empty collection", async ()=>{
        const res = await request(app).get("/item");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]); 
    });
  
});