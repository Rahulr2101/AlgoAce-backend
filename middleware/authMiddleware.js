const jwt = require( "jsonwebtoken");
const asyncHandler = require( "express-async-handler");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");

exports.protect = asyncHandler(async(req,res,next)=>{
  let token;

  token = req.cookies.token;
  if(token){
    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    }catch(err){
      res.status(401);
      throw new Error('Not authorized, token failed');
    }

  }else{
    res.status(401);
    throw new Error('Not authorized, no token');
  }
})
