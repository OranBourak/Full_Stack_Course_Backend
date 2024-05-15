import { Request, Response } from "express";
import mongoose from "mongoose";

class base_controller<ModelType> {
  itemModel: mongoose.Model<ModelType>;
  constructor(itemModel: mongoose.Model<ModelType>) {
    this.itemModel = itemModel;
  }
  // GET all items or items by email / owner
  async get(req: Request, res: Response) {
    console.log("get");
    try {
      // Check if a email query parameter is provided and filter objects by email
      if (req.query.email) {
        const item = await this.itemModel.find({ email: req.query.email });
        res.status(200).send(item);
      }
      // Check if a owner query parameter is provided and filter objects by owner
      else if (req.query.owner) {
        const item = await this.itemModel.find({ owner: req.query.owner });
        res.status(200).send(item);
      } else {
        // If no name query parameter, return all objects
        const item = await this.itemModel.find();
        res.status(200).send(item);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // GET by ID
  async getById(req: Request, res: Response) {
    console.log(req.params);
    try {
      // Find a student by the ID provided in the URL parameters
      const item = await this.itemModel.findById(req.params.id);
      if (!item) {
        return res.status(404).send("not found");
      } else {
        return res.status(200).send(item);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // POST a new item
  async post(req: Request, res: Response) {
    console.log("post controller");
    try {
      // Create a new object in the database with the provided request body
      const item = await this.itemModel.create(req.body);
      res.status(201).send(item); // 201 status code for resource creation
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // PUT (update) an item by ID
  async put(req: Request, res: Response) {
    const itemId = req.params.id; // Extracting the ID from the URL
    const updateData = req.body; // Assuming the body contains the update data

    try {
      // Update the student document with the specified ID
      const result = await this.itemModel.updateOne(
        { _id: itemId }, // Filter to find the item by ID
        updateData, // The update operations to be applied
        { runValidators: true } // Run schema validators on the update operation
      );

      // Handle the result based on matched and modified counts
      if (result.matchedCount === 0) {
        // If no documents were matched, return a 404 not found
        return res.status(404).send(" not found.");
      } else if (result.modifiedCount === 0) {
        // If the document was found but not modified, return a 200 with no changes message
        return res.status(200).send("No changes made to the item.");
      } else {
        // If the document was successfully updated, return a 200 success message
        return res.status(200).send("Item updated successfully.");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }

  // DELETE an item by ID
  async remove(req: Request, res: Response) {
    console.log("item remove controller");
    try {
      // Delete the student document with the specified ID
      await this.itemModel.findByIdAndDelete(req.params.id);
      return res.status(200).send(); // Return a 200 status code on successful deletion
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }
}
// Export the base controller to be used in routes
export default base_controller;
