"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the Item model
const item_model_1 = __importDefault(require("../models/item_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const itemController = new base_controller_1.default(item_model_1.default);
// Export the controllers to be used in routes
exports.default = itemController;
//# sourceMappingURL=item_controller.js.map