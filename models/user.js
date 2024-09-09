const { paramsScalarBits } = require('bcrypto/lib/js/dsa');
const e = require('express');
const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    password:
    {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', user);