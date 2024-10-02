const mongoose = require("mongoose");
const submission = require("./submission");
const { type } = require("bcrypto/lib/js/schnorr");

const GroupSchema = new mongoose.Schema({
    problemType: {
        type: String,
        ref: "Problems",
    },
    submissionCode:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problems",
    }]
});

module.exports = mongoose.model("Group", GroupSchema);