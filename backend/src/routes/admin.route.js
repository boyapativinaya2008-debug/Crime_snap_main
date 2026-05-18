const express = require("express");

const router = require("express").Router();

/* CONTROLLERS */

const {
  adminLogin,
  getAllUsers,
  deleteUser,
  blockUser,
  unblockUser,
  getAllOfficers,
  addOfficer,
  deleteOfficer,
  getLocations,
  addLocation,
  updateComplaintStatus,
  assignOfficer
} = require("../controllers/admin.controller");

const {
  getAllComplaints
} = require("../controllers/complaint.controller");

/* MIDDLEWARE */

const {
  protect,
  adminOnly,
} = require("../middleware/auth.middleware");

/* LOGIN */

router.post("/login", adminLogin);

/* USERS */

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.delete(
  "/user/:id",
  protect,
  adminOnly,
  deleteUser
);

router.put(
  "/block/:id",
  protect,
  adminOnly,
  blockUser
);

router.put(
  "/unblock/:id",
  protect,
  adminOnly,
  unblockUser
);

/* COMPLAINTS */

router.get(
  "/complaints",
  protect,
  adminOnly,
  getAllComplaints
);

router.put(
  "/update-status/:id",
  protect,
  adminOnly,
  updateComplaintStatus
);

router.put(
  "/assign-officer/:id",
  protect,
  adminOnly,
  assignOfficer
);

/* OFFICERS */

router.get(
  "/officers",
  protect,
  adminOnly,
  getAllOfficers
);

router.post(
  "/officers",
  protect,
  adminOnly,
  addOfficer
);

router.delete(
  "/officers/:id",
  protect,
  adminOnly,
  deleteOfficer
);

/* LOCATIONS */

router.get(
  "/locations",
  protect,
  adminOnly,
  getLocations
);

router.post(
  "/locations",
  protect,
  adminOnly,
  addLocation
);

module.exports = router;