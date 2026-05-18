const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,getMe
} = require("../controllers/auth.controller");
const { protect } = require(
  "../middleware/auth.middleware"
);

/* REGISTER */

router.post("/register", registerUser);

/* LOGIN */

router.post("/login", loginUser);

router.get("/me",protect,getMe);
module.exports = router;