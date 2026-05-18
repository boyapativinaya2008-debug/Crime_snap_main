const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashed,
      role: role || "user",
    });

    res.status(201).json({
      message: "Register success",
      user,
    });

  } catch (err) {

    console.log("ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {

  try {

    const { email, password, role } = req.body;

const user = await User.findOne({
  email: email.trim().toLowerCase(),
});

if (!user) {
  return res.status(400).json({ msg: "User not found" });
}

// ✅ ADD THIS BLOCK
if (role && user.role !== role) {
  return res.status(400).json({
    msg: `You are not registered as ${role}`,
  });
}

    if (user.status === "Blocked") {

      return res.status(403).json({
        msg: "Account blocked by admin",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Login success",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (err) {
  console.log("STATUS:", err.response?.status);
  console.log("ERROR DATA:", err.response?.data);

  setError(
    err.response?.data?.msg ||
    err.response?.data?.message ||
    err.response?.data?.error ||
    "Login failed"
  );
}
}

const getMe = async (req, res) => {

  try {

    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.json(user);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};