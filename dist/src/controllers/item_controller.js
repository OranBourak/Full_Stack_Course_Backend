"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the Item model
const item_model_1 = __importDefault(require("../models/item_model"));
// GET all items
const getItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("item get controller");
    try {
        let item;
        item = yield item_model_1.default.find();
        res.status(200).send(item);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// GET a items by student ID
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    try {
        // Find a items by the ID provided in the URL parameters
        const post = yield item_model_1.default.find({ owner: req.params.id });
        res.status(200).send(post);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// POST a new item
const postItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post item controller");
    try {
        // Create a new item document in the database with the provided request body
        const item = yield item_model_1.default.create(req.body);
        res.status(201).send(item); // 201 status code for resource creation
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// PUT (update) a item by ID
const putItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = req.params.id; // Extracting the ID from the URL
    const updateData = req.body; // Assuming the body contains the update data
    try {
        // Update the item document with the specified ID
        const result = yield item_model_1.default.updateOne({ _id: itemId }, // Filter to find the item by ID
        updateData, // The update operations to be applied
        { runValidators: true } // Run schema validators on the update operation
        );
        // Handle the result based on matched and modified counts
        if (result.matchedCount === 0) {
            // If no documents were matched, return a 404 not found
            return res.status(404).send("Item not found.");
        }
        else if (result.modifiedCount === 0) {
            // If the document was found but not modified, return a 200 with no changes message
            return res.status(200).send("No changes made to the item.");
        }
        else {
            // If the document was successfully updated, return a 200 success message
            return res.status(200).send("Item updated successfully.");
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// DELETE a item by ID
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("item delete controller");
    try {
        // Delete the item document with the specified ID
        yield item_model_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).send(); // Return a 200 status code on successful deletion
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// Export the controllers to be used in routes
exports.default = {
    getItem,
    getItemById,
    postItem,
    putItem,
    deleteItem,
};
//# sourceMappingURL=item_controller.js.map