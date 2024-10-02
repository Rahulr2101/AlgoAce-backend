const express = require("express");
const dotenv = require("dotenv");
const problems = require("./routes/problems");
const execute = require("./routes/judge");
const user = require("./routes/user");
const database = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const submission = require("./models/submission");
const User = require("./models/user");
const mongoose = require("mongoose");
const generate = require("./routes/gemini")
const details = require("./routes/home");

const app = express();
// Create HTTP server

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin || '*');  // Allow all origins
    },
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Inside your /webhook route

app.post("/webhook", async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.extra_params.userID;
    const userExist = await User.findById(userId);

    if (!userExist) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const submissionData = {
      problemID: req.body.extra_params.questionId,
      program: req.body.extra_params.program,
      testcaseID: req.body.extra_params.testcaseId,
      input: req.body.extra_params.input,
      excepted_output: req.body.extra_params.output,
      output: req.body.output,
      status: req.body.status,
      unique: req.body.extra_params.unique,
      error: req.body.error,
    };

    const newSubmission = await submission.create(submissionData);

    // Add the new submission to the user's submissions
    userExist.submissions.push(newSubmission._id);

    await userExist.save();

    console.log("Submission saved");
    return res.status(200).json({ message: 'Submission saved successfully' });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


const port = process.env.PORT || 3000;

database.connect();

app.use("/api/problem", problems);
app.use("/api", execute);
app.use("/api/auth", user);
app.use("/api",generate)
app.use("/api",details)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
