const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    owner: {
        type: String, // Use ObjectId to reference another document
        required: true,
        ref: 'Student' // Reference the Student model
    },
});

module.exports = mongoose.model('Post',postSchema);