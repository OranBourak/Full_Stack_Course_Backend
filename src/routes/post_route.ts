import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import authMiddleware from "../common/auth_middleware";

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
router.get("/", authMiddleware, PostController.get.bind(PostController));

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
router.get("/:id", authMiddleware, PostController.getById.bind(PostController));

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
router.post("/", authMiddleware, PostController.post.bind(PostController));

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
router.put("/:id", authMiddleware, PostController.put.bind(PostController));

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
router.delete(
  "/:id",
  authMiddleware,
  PostController.remove.bind(PostController)
);

router.put(
  "/like/:id",
  authMiddleware,
  PostController.likePost.bind(PostController)
);

router.put(
  "/unlike/:id",
  authMiddleware,
  PostController.unlikePost.bind(PostController)
);
export default router;
