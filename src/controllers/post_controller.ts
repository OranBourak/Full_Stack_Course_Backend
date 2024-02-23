// Import the Post model
import Post from "../models/post_model";
import BaseController  from "./base_controller";
import {IPost} from "../models/post_model";

const postController = new BaseController<IPost>(Post);

// Export the controllers to be used in routes
export default postController 
