// Import the Student model
const Student = require("../models/student_model");

// GET all students or students by name
const getStudents = async (req, res) => {
  console.log("student get controller");
  try {
    let student;
    // Check if a name query parameter is provided and filter students by name
    if (req.query.name) {
      student = await Student.find({ name: req.query.name });
    } else {
      // If no name query parameter, return all students
      student = await Student.find();
    }
    res.status(200).send(student);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// GET a single student by ID
const getStudentById = async (req, res) => {
  console.log(req.params);
  try {
    // Find a student by the ID provided in the URL parameters
    const student = await Student.findById(req.params.id);
    if(!student) {
      return res.status(404).send("Student not found");
    }else{
      return res.status(200).send(student);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// POST a new student
const postStudents = async (req, res) => {
  console.log("student post controller");
  try {
    // Create a new student document in the database with the provided request body
    const student = await Student.create(req.body);
    res.status(201).send(student); // 201 status code for resource creation
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// PUT (update) a student by ID
const putStudents = async (req, res) => {
  const studentId = req.params.id; // Extracting the ID from the URL
  const updateData = req.body; // Assuming the body contains the update data

  try {
    // Update the student document with the specified ID
    const result = await Student.updateOne(
      { _id: studentId }, // Filter to find the student by ID
      updateData, // The update operations to be applied
      { runValidators: true } // Run schema validators on the update operation
    );

    // Handle the result based on matched and modified counts
    if (result.matchedCount === 0) {
      // If no documents were matched, return a 404 not found
      return res.status(404).send("Student not found.");
    } else if (result.modifiedCount === 0) {
      // If the document was found but not modified, return a 200 with no changes message
      return res.status(200).send("No changes made to the student.");
    } else {
      // If the document was successfully updated, return a 200 success message
      return res.status(200).send("Student updated successfully.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// DELETE a student by ID
const deleteStudents = async (req, res) => {
  console.log("student delete controller");
  try {
    // Delete the student document with the specified ID
    await Student.findByIdAndDelete(req.params.id);
    return res.status(200).send(); // Return a 200 status code on successful deletion
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

// Export the controllers to be used in routes
module.exports = {
  getStudents,
  getStudentById,
  postStudents,
  putStudents,
  deleteStudents,
};
