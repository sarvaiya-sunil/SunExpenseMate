const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

exports.registerUser = async (req, res, next) => {
  const { fullName, email, password, profileImageUrl } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fileds are required!" });
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    return res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
      message: "User registered successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const loggedInUser = await User.findOne({ email: email });
    if (!loggedInUser || !(await loggedInUser.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    return res.status(200).json({
      id: loggedInUser._id,
      loggedInUser,
      token: generateToken(loggedInUser._id),
      message: "Login Successful",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // It will give sodument without password
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
