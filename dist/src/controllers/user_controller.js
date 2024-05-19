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
exports.userController = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
class UserController extends base_controller_1.default {
    constructor() {
        super(user_model_1.default);
    }
    getByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Fetching user by email:", req.params.email);
            try {
                // Fetch only the specified fields from the database
                const user = yield this.itemModel.findOne({ email: req.params.email }, "name email postCount bio imgUrl followers following" // Specify the fields to fetch
                );
                if (user) {
                    res.json({
                        name: user.name,
                        email: user.email,
                        postCount: user.postCount,
                        bio: user.bio,
                        imgUrl: user.imgUrl,
                        followers: user.followers,
                        following: user.following,
                    }); // Send only the specified user data if found
                }
                else {
                    return res.status(404).json({ message: "User not found" }); // Handle user not found
                }
            }
            catch (error) {
                console.error("Error fetching user by email:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    updateByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Updating user by email:", req.params.email);
            try {
                // Update the user with the specified email
                const user = yield this.itemModel.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
                if (user) {
                    res.json({
                        name: user.name,
                        email: user.email,
                        postCount: user.postCount,
                        bio: user.bio,
                        imgUrl: user.imgUrl,
                        followers: user.followers,
                        following: user.following,
                    }); // Send the updated user data
                }
                else {
                    return res.status(404).json({ message: "User not found" }); // Handle user not found
                }
            }
            catch (error) {
                console.error("Error updating user by email:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getMyId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //send the user ID back to the client
            const userId = req.body.user._id;
            return res.json({ userId });
        });
    }
    followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Following user:", req.params.userId);
            try {
                // Find the user by ID
                const user = yield this.itemModel.findById(req.body.user._id);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Check if the user is already being followed
                if (user.followers.includes(req.params.userId)) {
                    return res.status(400).json({ message: "User is already followed" });
                }
                // Add the user ID to the followers array
                user.followers.push(req.params.userId);
                yield user.save();
                return res.json({ message: "User followed successfully", user });
            }
            catch (error) {
                console.error("Error following user:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    unfollowUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Unfollowing user:", req.params.userId);
            try {
                // Find the user by ID
                const user = yield this.itemModel.findById(req.body.user._id);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Check if the user is not being followed
                if (!user.followers.includes(req.params.userId)) {
                    return res.status(400).json({ message: "User is not followed" });
                }
                // Remove the user ID from the followers array
                user.followers = user.followers.filter((id) => id !== req.params.userId);
                yield user.save();
                res.json({ message: "User unfollowed successfully", user });
            }
            catch (error) {
                console.error("Error unfollowing user:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getFollowing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Fetching followers for user:", req.body.user._id);
            try {
                // Find the user by ID
                const user = yield this.itemModel.findById(req.body.user._id);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Fetch only the followers array
                res.json({ following: user.following });
            }
            catch (error) {
                console.error("Error fetching followers:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.userController = new UserController();
//# sourceMappingURL=user_controller.js.map