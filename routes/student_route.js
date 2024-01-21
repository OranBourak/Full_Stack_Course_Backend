const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/student_controller.js")

router.get("/", StudentController.getStudents)



router.post("/", (req, res) => {
    res.send("student post");
})


router.put("/", (req, res) => {
    res.send("student put");
})

router.delete("/", (req, res) => {
    res.send("student delete");
})


module.exports = router;