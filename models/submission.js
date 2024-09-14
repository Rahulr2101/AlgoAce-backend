const { type } = require('bcrypto/lib/js/schnorr');
const mongoose = require('mongoose');


const submission = new mongoose.Schema({
    problemID:
    {
        type: String,
        ref: 'Problem',
        required: true
    },
    output:{
        type:String,
        required:true
    },
    program:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    date: {
        type: Date,   
        default: Date.now  
    },
    error:{
        type:String,
    },
    excepted_output:{
        type:String,
        required:true
    },
    testcaseID:{
        type:String,
        required:true
    },
    input:{
        type:String,
        required:true
    },
    unique:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('Submission', submission);
