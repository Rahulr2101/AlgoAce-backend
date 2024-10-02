
const e = require('express');
const mongoose = require('mongoose');


const Group = new mongoose.Schema(
    {
        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem',
        },
        code:{
            type:String,
            required:true
        },
        program:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        },
        
    }
  );

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
    submissions:[Group]
})

module.exports = mongoose.model('User', user);