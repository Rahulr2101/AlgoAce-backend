const { default: mongoose } = require("mongoose");
const submission = require("../models/submission");
const user = require("../models/user");

exports.getSubmissionById = async (req, res) => {
  try {
   
    const {questionId,unique } = req.body;
   
    const userId = req.user._id

    if (!userId) {
      return res.status(400).json({ message: "Please provide an id" });
    }
    const userExist = await user.findById({ _id: userId });
    const findSubmission = userExist.submission;
    const submiss = await submission.findOne({ problemID:questionId,unique:unique });
    console.log(submiss)
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json({ message: "Submission found", data: submiss });
  } catch (err) {
    console.error(`Error getting submission by id. \n${err}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getQuestionByIdRecent = async(req,res)=>{
    try{
        const {questionId} = req.body;
        const userId = req.user._id;
        if(!userId){
            return res.status(400).json({message:'Please provide an id'});
        }
        const userExist = await user.findById({_id:userId});
        const findSubmission = userExist.submission;
        const submiss = await submission.findOne({problemID:questionId}).sort({createdAt:-1});
        if(!submission){
            return res.status(404).json({message:'Submission not found'});
        }
        res.status(200).json({message:'Submission found',data:submiss});

    }catch(err){
        console.error(`Error getting submission by id. \n${err}`);
        res.status(500).json({message:'Internal server error'});
    }
}
