import express from "express";
import multer from 'multer';

const router = express.Router();

const base = "http://localhost:3000/"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    console.log("multer storage callback")
    const uniqueSuffix = Date.now() + '.jpg'
    cb(null, uniqueSuffix ) 
  }
})

const upload = multer({ storage: storage });

router.post('/file', upload.single("file"), function (req, res) {
  console.log("router.post(/file): " + base + req.file.path)
  res.status(200).send({url: base + req.file.path}) 
});

export default router;
