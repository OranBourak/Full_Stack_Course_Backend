"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class base_controller {
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    // GET all items or items by email / owner
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get");
            try {
                // Check if a email query parameter is provided and filter objects by email
                if (req.query.email) {
                    const item = yield this.itemModel.find({ email: req.query.email });
                    return res.status(200).send(item);
                }
                // Check if a owner query parameter is provided and filter objects by owner
                else if (req.query.owner) {
                    const item = yield this.itemModel.find({ owner: req.query.owner });
                    return res.status(200).send(item);
                }
                else {
                    // If no name query parameter, return all objects
                    const item = yield this.itemModel.find();
                    return res.status(200).send(item);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(400).send(error.message);
            }
        });
    }
    // GET by ID
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params);
            try {
                // Find a student by the ID provided in the URL parameters
                const item = yield this.itemModel.findById(req.params.id);
                if (!item) {
                    return res.status(404).send("not found");
                }
                else {
                    return res.status(200).send(item);
                }
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error.message);
            }
        });
    }
    // POST a new item
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("post base controller");
            try {
                // Create a new object in the database with the provided request body
                const item = yield this.itemModel.create(req.body);
                return res.status(201).send(item); // 201 status code for resource creation
            }
            catch (error) {
                console.log(error);
                return res.status(400).send(error.message);
            }
        });
    }
    // PUT (update) an item by ID
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemId = req.params.id; // Extracting the ID from the URL
            const updateData = req.body; // Assuming the body contains the update data
            try {
                // Update the student document with the specified ID
                const result = yield this.itemModel.updateOne({ _id: itemId }, // Filter to find the item by ID
                updateData, // The update operations to be applied
                { runValidators: true } // Run schema validators on the update operation
                );
                // Handle the result based on matched and modified counts
                if (result.matchedCount === 0) {
                    // If no documents were matched, return a 404 not found
                    return res.status(404).send(" not found.");
                }
                else if (result.modifiedCount === 0) {
                    // If the document was found but not modified, return a 200 with no changes message
                    return res.status(200).send("No changes made to the item.");
                }
                else {
                    // If the document was successfully updated, return a 200 success message
                    return res.status(200).send("Item updated successfully.");
                }
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error.message);
            }
        });
    }
    // DELETE an item by ID
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("item remove controller");
            try {
                // Delete the student document with the specified ID
                yield this.itemModel.findByIdAndDelete(req.params.id);
                return res.status(200).send(); // Return a 200 status code on successful deletion
            }
            catch (error) {
                console.log(error);
                res.status(400).send(error.message);
            }
        });
    }
}
// Export the base controller to be used in routes
exports.default = base_controller;
//# sourceMappingURL=base_controller.js.map