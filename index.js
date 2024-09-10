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

const app = express();
// Create HTTP server

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.post("/webhook", async (req, res) => {
  // Assuming the webhook contains userId
  try {
    console.log(req.body);
    const userId = req.body.extra_params.userID;
    const userExist = await User.findById(userId);

    if (!userExist) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }
    const submissions = await submission.create({
      problemID: req.body.extra_params.questionId,
      program:req.body.extra_params.program,
      output: req.body.output,
      status: req.body.status,
      unique: req.body.extra_params.unique,
    });
    await User.findByIdAndUpdate(userId, {
      $push: { submission: submissions._id },
    });
    userExist.save();
    console.log("Submission saved");
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3000;

database.connect();

app.use("/api/problem", problems);
app.use("/api", execute);
app.use("/api/auth", user);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
