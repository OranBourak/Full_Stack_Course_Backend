// Import the User model
import User from "../models/user_model";
import BaseController  from "./base_controller";
import {IUser} from "../models/user_model";

const userController = new BaseController<IUser>(User);

export default userController
