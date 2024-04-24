"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const item_controller_1 = __importDefault(require("../controllers/item_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
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
router.get("/", auth_middleware_1.default, item_controller_1.default.get.bind(item_controller_1.default));
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
router.get("/:id", auth_middleware_1.default, item_controller_1.default.getById.bind(item_controller_1.default));
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
router.post("/", auth_middleware_1.default, item_controller_1.default.post.bind(item_controller_1.default));
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
router.put("/:id", auth_middleware_1.default, item_controller_1.default.put.bind(item_controller_1.default));
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
router.delete("/:id", auth_middleware_1.default, item_controller_1.default.remove.bind(item_controller_1.default));
exports.default = router;
//# sourceMappingURL=item_route.js.map