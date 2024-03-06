"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the Student model
const student_model_1 = __importDefault(require("../models/student_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const studentController = new base_controller_1.default(student_model_1.default);
// Export the controllers to be used in routes
exports.default = studentController;
//# sourceMappingURL=student_controller.js.map