const user = require("../models/user");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const { generateToken } = require("../utils/generateToken");



exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }
    const userExists = await user.findOne({ email });
    user.find;
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = {
      name: name,
      email: email,
      password: hashedPassword,
    };
    const newUser = await user.create(payload);
    generateToken(res, newUser._id);
    console.log("newUser:", newUser.name);
    return res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email,password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }
    const userExists = await user.findOne({ email: email });
    if (!userExists) {
      console.log("User does not exist");
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      console.log("Invalid credentials");
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateToken(res, userExists._id);
    console.log("userExists:", userExists.name);
    return res
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        data: userExists,
      });
  } catch (err) {}
};
