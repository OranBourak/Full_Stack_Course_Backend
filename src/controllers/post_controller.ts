// Import the Post model
import Post from "../models/post_model";
import BaseController from "./base_controller";
import { IPost } from "../models/post_model";
import { Request, Response } from "express";

// Create a new PostController that extends the BaseController
// The BaseController has all the CRUD methods implemented
class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async post(req: Request, res: Response) {
    try {
      req.body.owner = req.body.user._id;
      return super.post(req, res);
    } catch (error) {
      console.log("Error posting:", error);
      return res.status(500).send("Error posting");
    }
  }

  async likePost(req: Request, res: Response) {
    const postId = req.params.id; // Get the post ID from URL parameters
    const userId = req.body.user._id; // Assuming user ID is attached to req.body.user by your auth middleware

    try {
      // Check if the user has already liked the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (post.likes.includes(userId)) {
        return res.status(400).send("User has already liked this post");
      }

      // Add user's ID to the likes array
      post.likes.push(userId);
      await post.save();

      return res.status(200).send({ message: "Post liked successfully", post });
    } catch (error) {
      console.log("Error liking post:", error);
      return res.status(500).send("Error liking post");
    }
  }

  async unlikePost(req: Request, res: Response) {
    const postId = req.params.id; // Get the post ID from URL parameters
    const userId = req.body.user._id; // Assuming user ID is attached to req.body.user by your auth middleware

    try {
      // Check if the user has already liked the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (!post.likes.includes(userId)) {
        return res.status(400).send("User has not liked this post");
      }

      // Remove user's ID from the likes array
      post.likes = post.likes.filter((id) => id !== userId);
      await post.save();

      return res
        .status(200)
        .send({ message: "Post unliked successfully", post });
    } catch (error) {
      console.log("Error unliking post:", error);
      return res.status(500).send("Error unliking post");
    }
  }
}

// Export the controllers to be used in routes
export default new PostController();
