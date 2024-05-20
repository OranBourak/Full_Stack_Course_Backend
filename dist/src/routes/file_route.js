"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const base = "http://192.168.7.32:3000/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        console.log("multer storage callback");
        const uniqueSuffix = Date.now() + ".jpg";
        cb(null, uniqueSuffix);
    },
});
const postStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/posts/");
    },
    filename: function (req, file, cb) {
        console.log("multer storage callback");
        const uniqueSuffix = Date.now() + ".jpg";
        cb(null, uniqueSuffix);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const postUpload = (0, multer_1.default)({ storage: postStorage });
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
        fs_1.default.unlinkSync(filePath); // Synchronous file deletion
        console.log("Image was deleted");
        res.status(200).send("Image was deleted");
    }
    catch (err) {
        console.error("Error deleting the image:", err);
        res.status(500).send("Error deleting the image");
    }
});
router.put("/postImageRemove", function (req, res) {
    console.log("########## postImageRemove ##########");
    console.log(req.body);
    const filePath = req.body.data.url.replace(base, "");
    console.log("filePath: " + filePath);
    try {
        fs_1.default.unlinkSync(filePath); // Synchronous file deletion
        console.log("The posts' image was deleted");
        res.status(200).send("Image was deleted");
    }
    catch (err) {
        console.error("Error deleting the image:", err);
        res.status(500).send("Error deleting the image");
    }
});
exports.default = router;
//# sourceMappingURL=file_route.js.map