const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
    savedUser.token = token;
    await savedUser.save();

    res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      savedUser,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Error registering user",
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exists" });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).cookie("token", token, { httpOnly: false }).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Server error",
    });
  }
};
