import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const base = "http://192.168.7.32:3000/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    console.log("multer storage callback");
    const uniqueSuffix = Date.now() + ".jpg";
    cb(null, uniqueSuffix);
  },
});

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/posts/");
  },
  filename: function (req, file, cb) {
    console.log("multer storage callback");
    const uniqueSuffix = Date.now() + ".jpg";
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const postUpload = multer({ storage: postStorage });

/**
 * @swagger
 * tags:
 *   - name: Image Management
 *     description: API endpoints for managing image uploads and deletions
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image
 *     tags: [Image Management]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL to access the uploaded image
 *                   example: 'http://192.168.7.32:3000/uploads/1597776456425.jpg'
 *       400:
 *         description: Error in uploading the image
 */
router.post("/upload", upload.single("file"), function (req, res) {
  console.log("router.post(/file): " + base + req.file.path);
  res.status(200).send({ url: base + req.file.path });
});

/**
 * @swagger
 * /postUpload:
 *   post:
 *     summary: Upload an image for a post
 *     tags: [Image Management]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload for the post.
 *     responses:
 *       200:
 *         description: Image for post uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL to access the uploaded post image
 *                   example: 'http://192.168.7.32:3000/uploads/posts/1597776456425.jpg'
 *       400:
 *         description: Error in uploading the image for the post
 */
router.post("/postUpload", postUpload.single("file"), function (req, res) {
  console.log("router.post(/file): " + base + req.file.path);
  res.status(200).send({ url: base + req.file.path });
});

/**
 * @swagger
 * /remove:
 *   delete:
 *     summary: Remove an image
 *     tags: [Image Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: Full URL of the image to be deleted
 *                 example: 'http://192.168.7.32:3000/uploads/1597776456425.jpg'
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       500:
 *         description: Error in deleting the image
 */
router.delete("/remove", function (req, res) {
  const filePath = req.body.url.replace(base, "");
  try {
    fs.unlinkSync(filePath); // Synchronous file deletion
    console.log("Image was deleted");
    res.status(200).send("Image was deleted");
  } catch (err) {
    console.error("Error deleting the image:", err);
    res.status(500).send("Error deleting the image");
  }
});

/**
 * @swagger
 * /postImageRemove:
 *   put:
 *     summary: Remove an image associated with a post
 *     tags: [Image Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     description: Full URL of the post image to be deleted
 *                     example: 'http://192.168.7.32:3000/uploads/posts/1597776456425.jpg'
 *     responses:
 *       200:
 *         description: Post image deleted successfully
 *       500:
 *         description: Error in deleting the post image
 */
router.put("/postImageRemove", function (req, res) {
  console.log("########## postImageRemove ##########");
  console.log(req.body);

  const filePath = req.body.data.url.replace(base, "");
  console.log("filePath: " + filePath);
  try {
    fs.unlinkSync(filePath); // Synchronous file deletion
    console.log("The posts' image was deleted");
    res.status(200).send("Image was deleted");
  } catch (err) {
    console.error("Error deleting the image:", err);
    res.status(500).send("Error deleting the image");
  }
});

export default router;
