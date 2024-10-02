const user = require("../models/user");

exports.getUserSubmission = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "Please provide an id" });
    }
    const userExist = await user.findById({ _id: userId });
    
    return res.status(200).json({ message: "User found", data: userExist.submissions });
  } catch (err) {
    console.log(err);
  }
};
