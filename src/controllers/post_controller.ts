// Import the Post model
import Post from "../models/post_model";
import BaseController  from "./base_controller";
import {IPost} from "../models/post_model";
import { Request, Response } from "express";

// Create a new PostController that extends the BaseController
// The BaseController has all the CRUD methods implemented
class PostController extends BaseController<IPost> {
    constructor(){
        super(Post);
    }

    async post(req: Request, res: Response) {
        req.body.owner = req.body.user._id;
        super.post(req, res);
    }
}

// Export the controllers to be used in routes
export default new PostController 
