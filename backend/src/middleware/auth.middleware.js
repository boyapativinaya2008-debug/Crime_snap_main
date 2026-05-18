const jwt = require("jsonwebtoken");

/* PROTECT ROUTE */

const protect = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    /* CHECK TOKEN */

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        msg: "No token provided",
      });
    }

    /* EXTRACT TOKEN */

    const token =
      authHeader.split(" ")[1];

    /* VERIFY TOKEN */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /* SAVE USER */

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      msg: "Token verification failed",
    });
  }
};

/* ADMIN ONLY */

const adminOnly = (req, res, next) => {

  if (req.user.role !== "admin") {

    return res.status(403).json({
      msg: "Admin access only",
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly,
};