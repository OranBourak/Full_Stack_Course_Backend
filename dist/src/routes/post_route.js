"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The Post API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - message
 *         - owner
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         message:
 *           type: string
 *           description: The content of the post
 *         owner:
 *           type: string
 *           description: The identifier of the owner of the post, which is a student ID
 *       example:
 *         title: 'My First Post'
 *         message: 'This is the content of my first post.'
 *         owner: '54321'
 */
/**
 * @swagger
 * /post:
 *   get:
 *     summary: Retrieve all posts
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error occurred
 */
router.get("/", auth_middleware_1.default, post_controller_1.default.get.bind(post_controller_1.default));
/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Retrieve a post by its ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the post to retrieve
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       400:
 *         description: Error occurred
 */
router.get("/:id", auth_middleware_1.default, post_controller_1.default.getById.bind(post_controller_1.default));
/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error occurred
 */
router.post("/", auth_middleware_1.default, post_controller_1.default.post.bind(post_controller_1.default));
/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update an existing post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Error occurred
 */
router.put("/:id", auth_middleware_1.default, post_controller_1.default.put.bind(post_controller_1.default));
/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Error occurred
 */
router.delete("/:id", auth_middleware_1.default, post_controller_1.default.remove.bind(post_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_route.js.map