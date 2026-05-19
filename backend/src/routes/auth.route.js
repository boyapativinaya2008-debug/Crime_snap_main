const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* MODELS */
const User = require("../models/user.model");
const Officer = require("../models/officer.model");

/* CONTROLLERS */
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

/* ================= USER ROUTES ================= */

/* REGISTER USER */
router.post("/register", registerUser);

/* LOGIN USER */
router.post("/login", loginUser);

/* GET LOGGED IN USER */
router.get("/me", protect, getMe);

/* ================= OFFICER LOGIN ================= */

router.post("/officer/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const officer = await Officer.findOne({ email });

    if (!officer) {
      return res.status(400).json({
        msg: "Officer not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      officer.password
    );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: officer._id,
        role: "officer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      officer,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
    });
  }
});

module.exports = router;