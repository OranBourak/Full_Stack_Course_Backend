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
        return res.status(404).json({ message: "User not found" }); // Handle user not found
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return res.status(500).json({ error: "Internal server error" });
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
        return res.status(404).json({ message: "User not found" }); // Handle user not found
      }
    } catch (error) {
      console.error("Error updating user by email:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getMyId(req: Request, res: Response) {
    //send the user ID back to the client
    const userId = req.body.user._id;
    return res.json({ userId });
  }

  async followUser(req: Request, res: Response) {
    console.log("Following user:", req.params.userId);
    try {
      // Find the user by ID
      const user = await this.itemModel.findById(req.body.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is already being followed
      if (user.followers.includes(req.params.userId)) {
        return res.status(400).json({ message: "User is already followed" });
      }

      // Add the user ID to the followers array
      user.followers.push(req.params.userId);
      await user.save();

      return res.json({ message: "User followed successfully", user });
    } catch (error) {
      console.error("Error following user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async unfollowUser(req: Request, res: Response) {
    console.log("Unfollowing user:", req.params.userId);
    try {
      // Find the user by ID
      const user = await this.itemModel.findById(req.body.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is not being followed
      if (!user.followers.includes(req.params.userId)) {
        return res.status(400).json({ message: "User is not followed" });
      }

      // Remove the user ID from the followers array
      user.followers = user.followers.filter((id) => id !== req.params.userId);
      await user.save();

      res.json({ message: "User unfollowed successfully", user });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getFollowing(req: Request, res: Response) {
    console.log("Fetching followers for user:", req.body.user._id);
    try {
      // Find the user by ID
      const user = await this.itemModel.findById(req.body.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch only the followers array
      res.json({ following: user.following });
    } catch (error) {
      console.error("Error fetching followers:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export const userController = new UserController();
