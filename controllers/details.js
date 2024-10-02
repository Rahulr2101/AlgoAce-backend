const user = require("../models/user");
const  problems = require('../models/problems');



exports.details = async(req,res)=>{
try{
   
    const userID = req.user._id;
    if(!userID){
        return res.status(400).json({message:'Please provide an id'});
    }
    const userExist = await user.findById({_id:userID});
    const allProblems = await problems.find({},"type");
    if(!allProblems){
        return res.status(404).json({message:'Problems not found'});
    }
    res.status(200).json({message:'All problems',data:allProblems,username:userExist.name});
}catch(err){
    console.error(`Error getting all problems. \n${err}`);
}
}