const { type } = require('bcrypto/lib/js/schnorr');
const mongoose = require('mongoose');


const submission = new mongoose.Schema({

    sumbmissionGroup:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Group'
        }
    ]
  
});

module.exports = mongoose.model('Submission', submission);
