import express from "express";
const router = express.Router();
import ItemController from "../controllers/item_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: Item
 *   description: The Item API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item
 *         owner:
 *           type: string
 *           description: The owner of the item, represented by a student ID
 *       example:
 *         name: 'Laptop'
 *         owner: '12345'
 */

/**
 * @swagger
 * /item:
 *   get:
 *     summary: Retrieve all items
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       400:
 *         description: Error occurred
 */
router.get("/", authMiddleware, ItemController.get.bind(ItemController));

/**
 * @swagger
 * /item/{id}:
 *   get:
 *     summary: Retrieve an item by its ID
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the item to retrieve
 *     responses:
 *       200:
 *         description: An item object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       400:
 *         description: Error occurred
 */
router.get("/:id", authMiddleware, ItemController.getById.bind(ItemController));

/**
 * @swagger
 * /item:
 *   post:
 *     summary: Create a new item
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Error occurred
 */
router.post("/", authMiddleware, ItemController.post.bind(ItemController));

/**
 * @swagger
 * /item/{id}:
 *   put:
 *     summary: Update an existing item by ID
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 *       400:
 *         description: Error occurred
 */
router.put("/:id", authMiddleware, ItemController.put.bind(ItemController));

/**
 * @swagger
 * /item/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 *       400:
 *         description: Error occurred
 */
router.delete(
  "/:id",
  authMiddleware,
  ItemController.remove.bind(ItemController)
);

export default router;
