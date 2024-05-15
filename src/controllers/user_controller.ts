import User from "../models/user_model";
import BaseController from "./base_controller";
import { IUser } from "../models/user_model";
import { Request, Response } from "express";

class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getByEmail(req: Request, res: Response) {
    console.log("Fetching user by email:", req.params.email);
    try {
      // Fetch only the specified fields from the database
      const user = await this.itemModel.findOne(
        { email: req.params.email },
        "name email postCount bio imgUrl followers following" // Specify the fields to fetch
      );
      if (user) {
        res.json({
          name: user.name,
          email: user.email,
          postCount: user.postCount,
          bio: user.bio,
          imgUrl: user.imgUrl,
          followers: user.followers,
          following: user.following,
        }); // Send only the specified user data if found
      } else {
        res.status(404).json({ message: "User not found" }); // Handle user not found
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateByEmail(req: Request, res: Response) {
    console.log("Updating user by email:", req.params.email);
    try {
      // Update the user with the specified email
      const user = await this.itemModel.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        { new: true }
      );
      if (user) {
        res.json({
          name: user.name,
          email: user.email,
          postCount: user.postCount,
          bio: user.bio,
          imgUrl: user.imgUrl,
          followers: user.followers,
          following: user.following,
        }); // Send the updated user data
      } else {
        res.status(404).json({ message: "User not found" }); // Handle user not found
      }
    } catch (error) {
      console.error("Error updating user by email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const userController = new UserController();
