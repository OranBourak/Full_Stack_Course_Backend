// Import the User model
import User from "../models/user_model";
import BaseController  from "./base_controller";
import {IUser} from "../models/user_model";

const userController = new BaseController<IUser>(User);

// Export the controllers to be used in routes
export default userController
