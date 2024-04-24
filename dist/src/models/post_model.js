"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    owner: {
        type: String, // Use ObjectId to reference another document
        required: true,
        ref: 'User' // Reference the User model
    },
});
exports.default = mongoose_1.default.model('Post', postSchema);
//# sourceMappingURL=post_model.js.map