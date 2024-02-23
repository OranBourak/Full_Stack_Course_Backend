"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const itemSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String, // Use ObjectId to reference another document
        required: true,
        ref: 'Student' // Reference the Student model
    },
});
exports.default = mongoose_1.default.model('Item', itemSchema);
//# sourceMappingURL=item_model.js.map