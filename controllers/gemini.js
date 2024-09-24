const gemini = require("../utils/gemini")


exports.generate = async(req,res) =>{
  try{
    var {message} = req.body 
    message  =  message + "Give hints only in a sophisticated learning way."
    if(!message){
      return res.status(400).json({
        success:false,
        message:"Message not found"
      })
    }
    const answer = await gemini.run(message)
    return res.status(200).json({
      success:true,
      message:"Success",
      data:answer
    })

  }catch(err){
    console.log("Something went wrong",err)
  }
}