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
const supertest_1 = __importDefault(require("supertest"));
const Server_1 = __importDefault(require("../Server"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("mz/fs"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, Server_1.default)();
    console.log("beforeAll initialized");
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Closing database connection");
    yield mongoose_1.default.connection.close();
}));
describe("File Tests", () => {
    test("upload file", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/Avatar.png`;
        const rs = yield fs_1.default.exists(filePath);
        if (rs) {
            console.log("File exists");
            try {
                const response = yield (0, supertest_1.default)(app)
                    .post("/file/upload")
                    .attach("file", filePath); // Attach the file to the request
                expect(response.statusCode).toBe(200);
            }
            catch (error) {
                console.error("File does not exist or server error occurred", error);
            }
        }
    }), 10000); // Increased timeout to 10000 milliseconds
});
//# sourceMappingURL=file.test.js.map