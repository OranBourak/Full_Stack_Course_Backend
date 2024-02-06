const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    owner: {
        type: String, // Use ObjectId to reference another document
        required: true,
        ref: 'Student' // Reference the Student model
    },
});

module.exports = mongoose.model('Item',itemSchema);