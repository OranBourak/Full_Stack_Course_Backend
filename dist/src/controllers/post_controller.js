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
const base_controller_1 = __importDefault(require("./base_controller"));
const user_model_1 = __importDefault(require("../models/user_model"));
// Create a new PostController that extends the BaseController
// The BaseController has all the CRUD methods implemented
class PostController extends base_controller_1.default {
    constructor() {
        super(post_model_1.default);
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.owner = req.body.user._id;
                yield user_model_1.default.findByIdAndUpdate(req.body.user._id, {
                    $inc: { postCount: 1 },
                });
                return _super.post.call(this, req, res);
            }
            catch (error) {
                console.log("Error posting:", error);
                return res.status(500).send("Error posting");
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id; // Get the post ID from URL parameters
            const userId = req.body.user._id; // Assuming user ID is attached to req.body.user by your auth middleware
            try {
                // Check if the user has already liked the post
                const post = yield post_model_1.default.findById(postId);
                if (!post) {
                    return res.status(404).send("Post not found");
                }
                if (post.likes.includes(userId)) {
                    return res.status(400).send("User has already liked this post");
                }
                // Add user's ID to the likes array
                post.likes.push(userId);
                yield post.save();
                return res.status(200).send({ message: "Post liked successfully", post });
            }
            catch (error) {
                console.log("Error liking post:", error);
                return res.status(500).send("Error liking post");
            }
        });
    }
    unlikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id; // Get the post ID from URL parameters
            const userId = req.body.user._id; // Assuming user ID is attached to req.body.user by your auth middleware
            try {
                // Check if the user has already liked the post
                const post = yield post_model_1.default.findById(postId);
                if (!post) {
                    return res.status(404).send("Post not found");
                }
                if (!post.likes.includes(userId)) {
                    return res.status(400).send("User has not liked this post");
                }
                // Remove user's ID from the likes array
                post.likes = post.likes.filter((id) => id !== userId);
                yield post.save();
                return res
                    .status(200)
                    .send({ message: "Post unliked successfully", post });
            }
            catch (error) {
                console.log("Error unliking post:", error);
                return res.status(500).send("Error unliking post");
            }
        });
    }
}
// Export the controllers to be used in routes
exports.default = new PostController();
//# sourceMappingURL=post_controller.js.map