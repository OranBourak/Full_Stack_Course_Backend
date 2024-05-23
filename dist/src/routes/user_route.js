"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user_controller");
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         bio:
 *           type: string
 *           description: A short bio for the user
 *         email:
 *           type: string
 *           description: The user email, used for login
 *         password:
 *           type: string
 *           description: The user's password, encrypted in storage
 *         imgUrl:
 *           type: string
 *           description: URL to the user's profile image
 *         tokens:
 *           type: array
 *           items:
 *             type: string
 *           description: Authentication tokens associated with the user
 *         postCount:
 *           type: integer
 *           description: Count of posts created by the user
 *       example:
 *         name: 'Oran Barak'
 *         bio: 'Software Engineer and Cybersecurity Specialist'
 *         email: 'oran@gmail.com'
 *         password: 'encryptedPassword'
 *         imgUrl: 'https://example.com/profiles/oran.jpg'
 *         tokens: ['token1', 'token2']
 *         postCount: 15
 */
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", auth_middleware_1.default, user_controller_1.userController.get.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/{email}:
 *   get:
 *     summary: 'Get a user by Email'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: 'oran@gmail.com'
 *         description: 'Unique email of the user to retrieve'
 *     responses:
 *       200:
 *         description: 'User details returned successfully'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 'User not found'
 *       500:
 *         description: 'Internal server error'
 */
router.get("/email/:email", auth_middleware_1.default, user_controller_1.userController.getByEmail.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/myId:
 *   get:
 *     summary: Get the logged-in user's ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User ID returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The ID of the logged-in user
 *                   example: '12345'
 *       401:
 *         description: Unauthorized
 */
router.get("/myId", auth_middleware_1.default, user_controller_1.userController.getMyId.bind(user_controller_1.userController));
router.get("/:id", auth_middleware_1.default, user_controller_1.userController.getById.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/following:
 *   get:
 *     summary: Retrieve list of users the logged-in user is following
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followed users returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/following/", auth_middleware_1.default, user_controller_1.userController.getFollowing.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/googleUserExisting:
 *   post:
 *     summary: Handle Google user login or registration
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Google user's email
 *                 example: 'example@gmail.com'
 *     responses:
 *       200:
 *         description: Google user processed successfully
 *       201:
 *         description: Google user do not exists
 */
router.post("/googleUserExisting", user_controller_1.userController.googleUserExisting.bind(user_controller_1.userController));
/**
 * @swagger
 * /user:
 *   post:
 *     summary: 'Create a new user'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: 'User created successfully'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", auth_middleware_1.default, user_controller_1.userController.post.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/{email}:
 *   put:
 *     summary: 'Update a user by Email'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: 'oran@gmail.com'
 *         description: 'Unique Email of the user to update'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: 'User updated successfully'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 'User not found'
 *       400:
 *         description: 'Error occurred during the update'
 */
router.put("/:email", auth_middleware_1.default, user_controller_1.userController.updateByEmail.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/follow/{userId}:
 *   put:
 *     summary: Follow another user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: '12345'
 *         description: Unique ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.put("/follow/:userId", auth_middleware_1.default, user_controller_1.userController.followUser.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/unfollow/{userId}:
 *   put:
 *     summary: Unfollow another user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: '12345'
 *         description: Unique ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.put("/unfollow/:userId", auth_middleware_1.default, user_controller_1.userController.unfollowUser.bind(user_controller_1.userController));
/**
 * @swagger
 * /user/{email}:
 *   delete:
 *     summary: 'Delete a user by Email'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: 'oran@gmail.com'
 *         description: 'Unique email of the user to delete'
 *     responses:
 *       200:
 *         description: 'User deleted successfully'
 *       404:
 *         description: 'User not found'
 *       400:
 *         description: 'Error occurred during the deletion'
 */
router.delete("/:email", auth_middleware_1.default, user_controller_1.userController.remove.bind(user_controller_1.userController));
exports.default = router;
//# sourceMappingURL=user_route.js.map