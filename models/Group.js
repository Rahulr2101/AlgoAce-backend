const mongoose = require("mongoose");
const submission = require("./submission");


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