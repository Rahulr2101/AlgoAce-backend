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
        version: "3.10.0",
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
        response = await fetch("https://emkc.org/api/v2/piston/execute", {
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

    if (!userExist.submissions.includes(problem._id)) { 
      console.log("problem._id", problem._id);
      const payload = {
        problemId: problem._id,
        type: problem.type,
        code: code,
        program: program,
      }
      userExist.submissions.push(payload); 
      await userExist.save();
    }
    await userExist.save();

   
    return res.status(200).json({ success: true, message: "Code executed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
