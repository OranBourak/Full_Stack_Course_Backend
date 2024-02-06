const express = require("express");
const router = express.Router();
const ItemController = require("../controllers/item_controller.js")

router.get("/", ItemController.getItem);

router.get("/:id",ItemController.getItemById);

router.post("/", ItemController.postItem);

router.put("/:id",ItemController.putItem);

router.delete("/:id",ItemController.deleteItem);

module.exports = router;