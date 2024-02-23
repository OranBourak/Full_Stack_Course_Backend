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
// Import the Post model
const post_model_1 = __importDefault(require("../models/post_model"));
// GET all posts
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post get controller");
    try {
        let post;
        post = yield post_model_1.default.find();
        res.status(200).send(post);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// GET a posts by student ID
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    try {
        // Find a posts by the ID provided in the URL parameters
        const post = yield post_model_1.default.find({ owner: req.params.id });
        res.status(200).send(post);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// POST a new post
const postPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post post controller");
    try {
        // Create a new post document in the database with the provided request body
        const post = yield post_model_1.default.create(req.body);
        res.status(201).send(post); // 201 status code for resource creation
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// PUT (update) a post by ID
const putPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id; // Extracting the ID from the URL
    const updateData = req.body; // Assuming the body contains the update data
    try {
        // Update the post document with the specified ID
        const result = yield post_model_1.default.updateOne({ _id: postId }, // Filter to find the post by ID
        updateData, // The update operations to be applied
        { runValidators: true } // Run schema validators on the update operation
        );
        // Handle the result based on matched and modified counts
        if (result.matchedCount === 0) {
            // If no documents were matched, return a 404 not found
            return res.status(404).send("Post not found.");
        }
        else if (result.modifiedCount === 0) {
            // If the document was found but not modified, return a 200 with no changes message
            return res.status(200).send("No changes made to the post.");
        }
        else {
            // If the document was successfully updated, return a 200 success message
            return res.status(200).send("Post updated successfully.");
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// DELETE a post by ID
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post delete controller");
    try {
        // Delete the post document with the specified ID
        yield post_model_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).send(); // Return a 200 status code on successful deletion
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// Export the controllers to be used in routes
exports.default = {
    getPost,
    getPostById,
    postPost,
    putPost,
    deletePost,
};
//# sourceMappingURL=post_controller.js.map