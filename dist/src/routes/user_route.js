"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
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
*         - image
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*         image:
*           type: string
*           description: The user image
*       example:
*         email: 'oran@gmail.com'
*         password: 'oran'
*         image: oran.jpg
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
*         description: list of all the users
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                  $ref: '#/components/schemas/User'
*/
router.get("/", auth_middleware_1.default, user_controller_1.default.get.bind(user_controller_1.default));
/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: 'Get a user by ID'
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: 'path'
 *         name: 'email'
 *         required: true
 *         schema:
 *           type: 'string'
 *           example: 'oran@gmail.com'
 *         description: 'Unique email of the user to retrieve'
 *     responses:
 *       '200':
 *         description: 'User details'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/:id", auth_middleware_1.default, user_controller_1.default.getById.bind(user_controller_1.default));
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
 *       '201':
 *         description: 'User created successfully'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", auth_middleware_1.default, user_controller_1.default.post.bind(user_controller_1.default));
/**
 * @swagger
 * /user/{email}:
 *   put:
 *     summary: 'Update a student by Email'
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
router.put("/:id", auth_middleware_1.default, user_controller_1.default.put.bind(user_controller_1.default));
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
 *         description: 'Unique ID of the user to delete'
 *     responses:
 *       200:
 *         description: 'User deleted successfully'
 *       404:
 *         description: 'User not found'
 *       400:
 *         description: 'Error occurred during the deletion'
 */
router.delete("/:id", auth_middleware_1.default, user_controller_1.default.remove.bind(user_controller_1.default));
exports.default = router;
//# sourceMappingURL=user_route.js.map