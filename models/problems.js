const mongoose = require('mongoose');


const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    constraints: [{
        type: String,
        required: true,
    }],
    input: [{
        type: String,
        required: true,
    }],
    output: [{
        type: String,
        required: true,
    }],
});

module.exports = mongoose.model('Problem', problemSchema);