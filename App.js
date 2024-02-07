const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const studentRoute = require("./routes/student_route");
const postRoute = require("./routes/post_route");
const itemRoute = require("./routes/item_route");
const bodyParser = require("body-parser");
  
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Database connected"));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
app.use("/student", studentRoute);
app.use("/post", postRoute);
app.use("/item", itemRoute)
  

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
  });
