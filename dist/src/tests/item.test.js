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
const item_model_1 = __importDefault(require("../models/item_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const testUser = {
    email: "testStudent@gmail.com",
    password: "1234567",
    image: "testStudent.jpg",
    accessToken: "",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, Server_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany({ email: testUser.email });
    yield item_model_1.default.deleteMany();
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
const testPost = {
    name: "test item",
    owner: "Oran Bourak",
};
describe("Item test", () => {
    test("Get /item - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/item")
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    }));
    test("POST /item", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/item")
            .send(testPost)
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(testPost.name);
        const res2 = yield (0, supertest_1.default)(app)
            .get("/item")
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body[0].name).toEqual(testPost.name);
        expect(res2.body[0].owner).toEqual(testPost.owner);
    }));
    test("GET /item/:id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/item")
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res.statusCode).toEqual(200);
        const data = res.body;
        expect(data.length).toBe(1);
        const id = data[0]._id;
        const res2 = yield (0, supertest_1.default)(app)
            .get("/item/" + id)
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.name).toEqual(testPost.name);
        expect(res2.body.owner).toEqual(testPost.owner);
    }));
    test("PUT /item/:id - update item by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/item")
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res.statusCode).toEqual(200);
        const data = res.body;
        expect(data.length).toBe(1);
        const id = data[0]._id;
        const updatedPost = {
            name: "updated name",
            owner: "updated owner",
        };
        const res2 = yield (0, supertest_1.default)(app)
            .put("/item/" + id)
            .send(updatedPost)
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res2.statusCode).toEqual(200);
        const res3 = yield (0, supertest_1.default)(app)
            .get("/item/" + id)
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res3.statusCode).toEqual(200);
        expect(res3.body.name).toEqual(updatedPost.name);
        expect(res3.body.owner).toEqual(updatedPost.owner);
    }));
    test("Fail GET /item/:id - get item using fake ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/item")
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res.statusCode).toEqual(200);
        const data = res.body;
        const id = data[0]._id;
        const fakeID = id.slice(0, -4) + "1111";
        const res1 = yield (0, supertest_1.default)(app)
            .get("/item/" + fakeID)
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res1.statusCode).toBe(404);
    }));
    test("DELETE /item/:id - delete item by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/item")
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res.statusCode).toEqual(200);
        const data = res.body;
        const id = data[0]._id;
        const res2 = yield (0, supertest_1.default)(app)
            .delete("/item/" + id)
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res2.statusCode).toEqual(200);
        const res3 = yield (0, supertest_1.default)(app)
            .get("/item/" + id)
            .set("Authorization", "Bearer " + testUser.accessToken);
        expect(res3.statusCode).toEqual(404);
    }));
});
//# sourceMappingURL=item.test.js.map