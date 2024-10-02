
const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  typeName:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:true
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  constraints: [
    {
      type: String,
      required: true,
    },
  ],
  examples: [exampleSchema],
  testcase: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
  tags: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("Problem", problemSchema);
