const { type } = require('bcrypto/lib/js/schnorr');
const mongoose = require('mongoose');


const submission = new mongoose.Schema({

    sumbmissionGroup:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Group'
        },
        {type:mongoose.Schema.Types.ObjectId,
        ref:'Problems'
        }
    ]
  
});

module.exports = mongoose.model('Submission', submission);
