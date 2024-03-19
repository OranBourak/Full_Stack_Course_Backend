import express from "express";
const router = express.Router();
import StudentController from "../controllers/student_controller";
import authMiddleware from "../common/auth_middleware";


/**
* @swagger
* tags:
*   name: Student
*   description: The Student API
*/

/**
* @swagger
* components:
*   schemas:
*     Student:
*       type: object
*       required:
*         - _id
*         - name
*         - age
*       properties:
*         _id:
*           type: string
*           description: The user id
*         name:
*           type: string
*           description: The user name
*         age:
*           type: number
*           description: The user age
*       example:
*         _id: '12345'
*         name: 'oran'
*         age: 29
*/


/**
* @swagger
* /student:
*   get:
*     summary: Get all students
*     tags: [Student]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: list of all the students
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                  $ref: '#/components/schemas/Student'
*/
router.get("/",authMiddleware, StudentController.get.bind(StudentController));

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: 'Get a student by ID'
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: 'path'
 *         name: 'id'
 *         required: true
 *         schema:
 *           type: 'string'
 *           example: '12345'
 *         description: 'Unique ID of the student to retrieve'
 *     responses:
 *       '200':
 *         description: 'Student details'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.get("/:id",authMiddleware, StudentController.getById.bind(StudentController));


/**
 * @swagger
 * /student:
 *   post:
 *     summary: 'Create a new student'
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       '201':
 *         description: 'Student created successfully'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.post("/",authMiddleware, StudentController.post.bind(StudentController));



/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: 'Update a student by ID'
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '12345'
 *         description: 'Unique ID of the student to update'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: 'Student updated successfully'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: 'Student not found'
 *       400:
 *         description: 'Error occurred during the update'
 */
router.put("/:id",authMiddleware, StudentController.put.bind(StudentController));


/**
 * @swagger
 * /student/{id}:
 *   delete:
 *     summary: 'Delete a student by ID'
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '12345'
 *         description: 'Unique ID of the student to delete'
 *     responses:
 *       200:
 *         description: 'Student deleted successfully'
 *       404:
 *         description: 'Student not found'
 *       400:
 *         description: 'Error occurred during the deletion'
 */
router.delete("/:id",authMiddleware, StudentController.remove.bind(StudentController));


export default router;