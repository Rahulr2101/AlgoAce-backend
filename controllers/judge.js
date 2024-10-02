const user = require("../models/user");
const problems = require("../models/problems");
const group = require("../models/Group");
const submission = require("../models/submission");

exports.getUserSubmission = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "Please provide a user ID" });
    }
    const userExist = await user.findById(userId);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", data: userExist.submissions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.execute = async (req, res) => {
  try {
    const { code, questionId, unique, program } = req.body;
    const userID = req.user._id;

    // Validate user existence
    const userExist = await user.findById(userID);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the problem
    const problem = await problems.findById(questionId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const examples = problem.testcase;

    for (const testcase of examples) {
      const bodyContent = JSON.stringify({
        language: "python",
        version: "3.12.0",
        files: [{ name: "temp.py", content: code }],
        stdin: testcase.input,
      });

      const headersList = {
        Accept: "*/*",
        "localtonet-skip-warning": true,
        "Content-Type": "application/json",
      };

      let response;
      try {
        response = await fetch("https://jcseao9.localto.net/api/v2/execute", {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        });
      } catch (error) {
        console.error("Fetch error:", error.message);
        return res.status(500).json({
          message: "Internal server error during fetch",
          error: error.message,
        });
      }

      const data = await response.json();
      // Handle output comparison
      if (data.run && data.run.stdout.trim() !== testcase.output.trim()) {
        return res.status(200).json({
          success: false,
          message: "Testcase Failed",
          data,
          data1: {
            expected: testcase.output,
            got: data.run.stdout,
            input: testcase.input,
          },

        });
      }
    }

    // Group handling
    let groupRecord = await group.findOne({ problemType: problem.type });
    if (!groupRecord) {
      groupRecord = await group.create({ problemType: problem.type });
    }

    // Save submission
    await submission.create({
      userId: userID,
      problemId: questionId,
      code,
      result: "Success", // You can adjust this based on execution results
      createdAt: new Date(),
    });

    await group.findOneAndUpdate(
      { problemType: problem.type },
      { $push: { submissionCode: problem._id } }
    );

    return res.status(200).json({ success: true, message: "Code executed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
