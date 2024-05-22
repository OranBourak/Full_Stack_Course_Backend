"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = __importDefault(require("crypto"));
const client = new google_auth_library_1.OAuth2Client("259698500105-5v2g2mnfto185u6ebm282a0afeve4en2.apps.googleusercontent.com");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("register function received:" + req.body);
    const email = req.body.email;
    const password = req.body.password;
    const imgUrl = req.body.imgUrl;
    const userName = req.body.name;
    if (email == null || password == null || imgUrl == null) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user) {
            const filePath = path_1.default.join(__dirname, "../../../", "uploads", path_1.default.basename(imgUrl));
            try {
                fs_1.default.unlinkSync(filePath); // Synchronous file deletion
                console.log("Image was deleted because user already exists");
            }
            catch (err) {
                console.error("Error deleting the image:", err);
            }
            return res.status(400).send("User already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_model_1.default.create({
            name: userName,
            email: email,
            password: hashedPassword,
            imgUrl: imgUrl,
        });
        return res.status(200).send(newUser);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
//generate access token & refresh token for user id
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({
        _id: userId,
    }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: userId, salt: crypto_1.default.randomBytes(16).toString("hex") }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(400).send("invalid email or password");
        }
        const valid = yield bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(400).send("invalid email or password");
        }
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        if (user.tokens == null) {
            user.tokens = [refreshToken];
        }
        else {
            user.tokens.push(refreshToken);
        }
        yield user.save();
        return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
});
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: id_token,
            audience: "259698500105-5v2g2mnfto185u6ebm282a0afeve4en2.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();
        let user = yield user_model_1.default.findOne({ email: payload.email });
        if (!user) {
            user = yield user_model_1.default.create({
                email: payload.email,
                name: payload.name,
                imgUrl: payload.picture,
            });
        }
        const tokens = generateTokens(user._id.toString());
        res.status(200).send(tokens);
    }
    catch (error) {
        res.status(400).send("Error processing Google login");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logout");
    try {
        const user = yield user_model_1.default.findById(req.body.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "No access token provided" });
        }
        user.tokens = user.tokens.filter((token) => token.trim() == refreshToken.trim());
        yield user.save();
        return res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "An error occurred during logout",
            error: error.message,
        });
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //extract token
    const refreshTokenOrig = req.body.refreshToken;
    if (refreshTokenOrig == null) {
        return res.status(401).send("missing token");
    }
    //verify token
    jsonwebtoken_1.default.verify(refreshTokenOrig, process.env.REFRESH_TOKEN_SECRET, (err, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).send("invalid token");
        }
        try {
            const user = yield user_model_1.default.findById(userInfo._id);
            if (user == null ||
                user.tokens == null ||
                !user.tokens.includes(refreshTokenOrig)) {
                if (user.tokens != null) {
                    user.tokens = [];
                    yield user.save();
                }
                return res.status(403).send("invalid token");
            }
            //generate new access token
            const { accessToken, refreshToken } = generateTokens(user._id.toString());
            //update refresh token in db
            user.tokens = user.tokens.filter((token) => token != refreshTokenOrig);
            user.tokens.push(refreshToken);
            yield user.save();
            //return new access token & new refresh token
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).send(error.message);
        }
    }));
});
exports.default = {
    register,
    login,
    logout,
    refresh,
    googleLogin,
};
//# sourceMappingURL=auth_controller.js.map