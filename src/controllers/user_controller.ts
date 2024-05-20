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

      // Find the user to follow by ID
      const userToFollow = await this.itemModel.findById(req.params.userId);

      if (!userToFollow) {
        return res.status(404).json({ message: "User to follow not found" });
      }

      // Check if the user is already being followed
      if (user.following.includes(req.params.userId)) {
        return res.status(400).json({ message: "User is already followed" });
      }

      // Add the user ID to the following array
      user.following.push(req.params.userId);
      await user.save();

      userToFollow.followers.push(req.body.user._id);
      await userToFollow.save();

      return res.status(200).json({ message: "User followed successfully" });
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

      // Find the user to unfollow by ID
      const userToUnfollow = await this.itemModel.findById(req.params.userId);

      if (!userToUnfollow) {
        return res.status(404).json({ message: "User to unfollow not found" });
      }

      // Check if the user is not being followed
      if (!user.following.includes(req.params.userId)) {
        return res.status(400).json({ message: "User is not followed" });
      }

      // Remove the user ID from the following array
      user.following = user.following.filter((id) => id !== req.params.userId);
      await user.save();

      // Remove the user ID from the followers array
      console.log("userToUnfollow:", userToUnfollow);
      console.log("req.body.user._id:", req.body.user._id);
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id !== req.body.user._id
      );
      await userToUnfollow.save();

      res.status(200).json({ message: "User unfollowed successfully" });
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
