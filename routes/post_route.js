const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post_controller.js")

router.get("/", PostController.getPost);

router.get("/:id",PostController.getPostById);

router.post("/", PostController.postPost);

router.put("/:id",PostController.putPost);

router.delete("/:id",PostController.deletePost);

module.exports = router;