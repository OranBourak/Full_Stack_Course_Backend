// Import the Item model
import Item from "../models/item_model";
import BaseController from "./base_controller";
import { IItem } from "../models/item_model";

const itemController = new BaseController<IItem>(Item);

// Export the controllers to be used in routes
export default itemController;
