const { paramsScalarBits } = require('bcrypto/lib/js/dsa');
const { type } = require('bcrypto/lib/js/schnorr');
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
    },
    submissions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }]
})

module.exports = mongoose.model('User', user);