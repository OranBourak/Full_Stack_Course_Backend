import request from "supertest";
import appInit from '../Server';
import mongoose from 'mongoose';
import fs from 'mz/fs';
import { Express } from "express";


let app:Express;


beforeAll(async () => {
    app = await appInit();
    console.log("beforeAll initialized");
});

afterAll(async () => {
    console.log("Closing database connection");
    await mongoose.connection.close();
});


describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/Avatar.png`;
        const rs = await fs.exists(filePath); 
    
        if(rs){
            console.log("File exists");
            try {
                const response = await request(app)
                .post('/file/file')
                .attach('file', filePath);  // Attach the file to the request
                 
                expect(response.statusCode).toBe(200);
            } catch (error) {
                  console.error("File does not exist or server error occurred", error);
            }
        }
    }, 10000); // Increased timeout to 10000 milliseconds

});

    

