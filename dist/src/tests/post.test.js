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
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const testUser = {
    email: "testPost@gmail.com",
    password: "12345678",
    image: "testPost.jpg",
    accessToken: null
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, Server_1.default)();
    console.log("beforeAll");
    yield post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ email: testUser.email });
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mongoose_1.default.connection.close();
}));
describe("Post test", () => {
    test("Get /post - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/post").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    }));
    const post = {
        title: "test post title",
        message: "test post message",
        owner: "Oran"
    };
    test("Post /post - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/post")
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send(post);
        expect(res.statusCode).toBe(201);
    }));
    test("Get /post - posted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/post").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data.length).toBe(1);
        expect(data[0].title).toBe(post.title);
        expect(data[0].message).toBe(post.message);
    }));
    test("Get /post:id - get post by ID ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/post").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data.length).toBe(1);
        const ID = data[0]._id;
        const res2 = yield (0, supertest_1.default)(app).get("/post/" + ID).set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);
    }));
    test("Put /post:id - update post by ID ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/post").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        const ID = data[0]._id;
        const updatedPost = {
            title: "updated title",
            message: "updated message"
        };
        const res2 = yield (0, supertest_1.default)(app).put("/post/" + ID).set('Authorization', 'Bearer ' + testUser.accessToken).send(updatedPost);
        expect(res2.statusCode).toBe(200);
        const res3 = yield (0, supertest_1.default)(app).get("/post/" + ID).set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res3.statusCode).toBe(200);
        expect(res3.body.title).toBe(updatedPost.title);
    }));
    test("Delete /post:id - delete post by ID ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/post").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        const ID = data[0]._id;
        const res2 = yield (0, supertest_1.default)(app).delete("/post/" + ID).set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);
        const res3 = yield (0, supertest_1.default)(app).get("/post/" + ID).set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res3.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=post.test.js.map