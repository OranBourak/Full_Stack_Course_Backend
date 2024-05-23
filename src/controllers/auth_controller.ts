import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
const client = new OAuth2Client(
  "259698500105-5v2g2mnfto185u6ebm282a0afeve4en2.apps.googleusercontent.com"
);

const register = async (req: Request, res: Response) => {
  console.log("register function received:" + req.body);
  const email = req.body.email;
  const password = req.body.password;
  const imgUrl = req.body.imgUrl;
  const userName = req.body.name;

  if (email == null || password == null || imgUrl == null) {
    return res.status(400).send("missing email or password");
  }

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const filePath = path.join(
        __dirname,
        "../../../",
        "uploads",
        path.basename(imgUrl)
      );
      try {
        fs.unlinkSync(filePath); // Synchronous file deletion
        console.log("Image was deleted because user already exists");
      } catch (err) {
        console.error("Error deleting the image:", err);
      }
      return res.status(400).send("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: userName,
      email: email,
      password: hashedPassword,
      imgUrl: imgUrl,
    });

    return res.status(200).send(newUser);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

//generate access token & refresh token for user id
const generateTokens = (
  userId: string
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    {
      _id: userId,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRATION,
    }
  );

  const refreshToken = jwt.sign(
    { _id: userId, salt: crypto.randomBytes(16).toString("hex") },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const login = async (req: Request, res: Response) => {
  console.log("login");

  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).send("missing email or password");
  }

  try {
    const user = await User.findOne({ email: email });

    if (user == null) {
      return res.status(400).send("invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).send("invalid email or password");
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    if (user.tokens == null) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }
    await user.save();
    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

const googleLogin = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience:
        "259698500105-5v2g2mnfto185u6ebm282a0afeve4en2.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        imgUrl: payload.picture,
      });
    }

    const tokens = generateTokens(user._id.toString());
    res.status(200).send(tokens);
  } catch (error) {
    res.status(400).send("Error processing Google login");
  }
};

const logout = async (req, res) => {
  console.log("logout");
  try {
    const user = await User.findById(req.body.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "No access token provided" });
    }

    user.tokens = user.tokens.filter(
      (token) => token.trim() == refreshToken.trim()
    );
    await user.save();
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "An error occurred during logout",
      error: error.message,
    });
  }
};

const refresh = async (req: Request, res: Response) => {
  //extract token
  const refreshTokenOrig = req.body.refreshToken;

  if (refreshTokenOrig == null) {
    return res.status(401).send("missing token");
  }

  //verify token
  jwt.verify(
    refreshTokenOrig,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, userInfo: { _id: string }) => {
      if (err) {
        return res.status(403).send("invalid token");
      }

      try {
        const user = await User.findById(userInfo._id);
        if (
          user == null ||
          user.tokens.length === 0 ||
          !user.tokens.includes(refreshTokenOrig)
        ) {
          user.tokens = [];
          await user.save();

          return res.status(403).send("invalid token");
        }

        //generate new access token
        const { accessToken, refreshToken } = generateTokens(
          user._id.toString()
        );

        //update refresh token in db
        user.tokens = user.tokens.filter((token) => token != refreshTokenOrig);
        user.tokens.push(refreshToken);
        await user.save();

        //return new access token & new refresh token
        return res.status(200).send({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
    }
  );
};

export default {
  register,
  login,
  logout,
  refresh,
  googleLogin,
};
