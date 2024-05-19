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

router.post("/upload", upload.single("file"), function (req, res) {
  console.log("router.post(/file): " + base + req.file.path);
  res.status(200).send({ url: base + req.file.path });
});

router.post("/postUpload", postUpload.single("file"), function (req, res) {
  console.log("router.post(/file): " + base + req.file.path);
  res.status(200).send({ url: base + req.file.path });
});

// remove exiting image
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

export default router;
