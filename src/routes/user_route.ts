import express from "express";
import { userController } from "../controllers/user_controller";
import authMiddleware from "../common/auth_middleware";

const router = express.Router();

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
router.get("/", authMiddleware, userController.get.bind(userController));

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
router.get(
  "/email/:email",
  authMiddleware,
  userController.getByEmail.bind(userController)
);

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
router.get(
  "/myId",
  authMiddleware,
  userController.getMyId.bind(userController)
);

router.get("/:id", authMiddleware, userController.getById.bind(userController));
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
router.get(
  "/following/",
  authMiddleware,
  userController.getFollowing.bind(userController)
);

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
router.post(
  "/googleUserExisting",
  userController.googleUserExisting.bind(userController)
);

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
router.post("/", authMiddleware, userController.post.bind(userController));

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
router.put(
  "/:email",
  authMiddleware,
  userController.updateByEmail.bind(userController)
);

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
router.put(
  "/follow/:userId",
  authMiddleware,
  userController.followUser.bind(userController)
);

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
router.put(
  "/unfollow/:userId",
  authMiddleware,
  userController.unfollowUser.bind(userController)
);

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
router.delete(
  "/:email",
  authMiddleware,
  userController.remove.bind(userController)
);

export default router;
