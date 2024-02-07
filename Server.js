const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const studentRoute = require("./routes/student_route");
const postRoute = require("./routes/post_route");
const itemRoute = require("./routes/item_route");
const bodyParser = require("body-parser");
  
//Using a function initApp  to correctly schedule the order of operations
const initApp = ()=>{
    const promise = new Promise(async (resolve)=>{
        const db = mongoose.connection;
        db.on("error", (err) => console.log(err));
        db.once("open", () => console.log("Database connected"));
        await mongoose.connect(process.env.DATABASE_URL_FOR_TESTING);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use("/student", studentRoute);
        app.use("/post", postRoute);
        app.use("/item", itemRoute);
        resolve(app);
    });

   return promise; 
};
  
module.exports = initApp;