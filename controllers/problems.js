const { default: mongoose } = require("mongoose");
const problems = require("../models/problems");

exports.createProblems = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      difficulty,
      constraints,
      examples,
      testcase,
      tags,
    } = req.body;
    if (
      !title ||
      !description ||
      !type ||
      !difficulty ||
      !constraints ||
      !examples ||
      !testcase ||
      !tags
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const playload = {
      title: title,
      type: type,
      description: description,
      difficulty: difficulty,
      constraints: constraints,
      examples: examples,
      testcase: testcase,
      tags: tags,
    };
    const newProblem = await problems.create(playload);
    return res
      .status(201)
      .json({ message: "Problem created successfully", data: newProblem });
  } catch (err) {
    console.error(`Error creating problem. \n${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide an id" });
    }
    const problem = await problems.findById({ _id: id });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem found", data: problem });
  } catch (err) {
    console.error(`Error getting problem by id. \n${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const allProblems = await problems.find();
    res.status(200).json({ message: "All problems", data: allProblems });
  } catch (err) {
    console.error(`Error getting all problems. \n${err}`);
  }
};

exports.getProblemByTag = async (req, res) => {
  try {
    const { tag } = req.params;
  
    console.log(tag)
    if (!tag) {
      return res.status(400).json({ message: "Please provide a tag" });
    }
    const problemsByTag = await problems.find({ type: tag });
    if (problemsByTag.length === 0) {
      return res.status(404).json({ message: "No problems found with this tag" });
    }
    return res.status(200).json({ message: "Problems found", data: problemsByTag });
  } catch (err) {
    console.error(`Error getting problems by tag. \n${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide an id" });
    }
    const problem = await problems.findByIdAndDelete({ _id: id });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (err) {
    console.error(`Error deleting problem. \n${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
