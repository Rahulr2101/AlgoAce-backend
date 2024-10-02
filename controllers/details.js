const User = require("../models/user");
const Problem = require('../models/problems');

exports.details = async (req, res) => {
  try {
    const userID = req.user._id;
    if (!userID) {
      return res.status(400).json({ message: "Please provide a user ID" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allProblems = await Problem.find({}, "type typeName difficulty");
    if (!allProblems) {
      return res.status(404).json({ message: "No problems found" });
    }

    const problemTypes = {};
    const totalCounts = { easy: 0, medium: 0, hard: 0 }; 

    allProblems.forEach((problem) => {
      if (!problemTypes[problem.type]) {
        problemTypes[problem.type] = {
          typeName: problem.typeName,
          problems: [],
          difficultyCounts: { easy: 0, medium: 0, hard: 0 },
        };
      }
      problemTypes[problem.type].problems.push(problem._id);
      if (problem.difficulty.toLowerCase() === "easy") {
        problemTypes[problem.type].difficultyCounts.easy += 1;
        totalCounts.easy += 1;
      } else if (problem.difficulty.toLowerCase() === "medium") {
        problemTypes[problem.type].difficultyCounts.medium += 1;
        totalCounts.medium += 1;
      } else if (problem.difficulty.toLowerCase() === "hard") {
        problemTypes[problem.type].difficultyCounts.hard += 1;
        totalCounts.hard += 1;
      }
    });

    const userProgress = {};
    let totalCompletedProblems = 0;
    let totalProblemsCount = 0;

    const solvedCounts = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    Object.keys(problemTypes).forEach((type) => {
      const problemsOfType = problemTypes[type].problems;
      const completedProblemsOfType = user.submissions.filter(
        (submission) => submission.type === type
      );

      const totalProblems = problemsOfType.length;
      const completedProblems = completedProblemsOfType.length;
      const progress = ((completedProblems / totalProblems) * 100).toFixed(2);

      totalCompletedProblems += completedProblems;
      totalProblemsCount += totalProblems;

      completedProblemsOfType.forEach((submission) => {
        if (submission.problemId) {
          const problem = allProblems.find(p => p._id.toString() === submission.problemId.toString());
          if (problem) {
            if (problem.difficulty.toLowerCase() === "easy") {
              solvedCounts.easy += 1;
            } else if (problem.difficulty.toLowerCase() === "medium") {
              solvedCounts.medium += 1;
            } else if (problem.difficulty.toLowerCase() === "hard") {
              solvedCounts.hard += 1;
            }
          }
        }
      });
      
      userProgress[type] = {
        typeName: problemTypes[type].typeName,
        totalProblems,
        completedProblems,
        progress: progress,
      };
    });

    const totalProgress = totalProblemsCount > 0
      ? ((totalCompletedProblems / totalProblemsCount) * 100).toFixed(2)
      : "0.00";

    res.status(200).json({
      message: "All problems and user progress",
      data: userProgress,
      username: user.name,
      totalProblems: totalProblemsCount,
      completedProblems: totalCompletedProblems,
      totalProgress: totalProgress,
      solvedCounts,
      totalCounts,
    });
  } catch (err) {
    console.error(`Error getting user progress. \n${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};