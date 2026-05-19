const router = require("express").Router();

const {
  adminLogin,
  getAllUsers,
  deleteUser,
  blockUser,
  unblockUser,
  updateComplaintStatus,
  assignOfficer,
  getAllOfficers,
  addOfficer,
  deleteOfficer,
  getLocations,
  addLocation,
} = require("../controllers/admin.controller");

const {
  getAllComplaints,
} = require("../controllers/complaint.controller");

const {
  protect,
  adminOnly,
} = require("../middleware/auth.middleware");

/* AUTH */
router.post("/login", adminLogin);

/* USERS */
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/user/:id", protect, adminOnly, deleteUser);
router.put("/block/:id", protect, adminOnly, blockUser);
router.put("/unblock/:id", protect, adminOnly, unblockUser);

/* COMPLAINTS */
router.get("/complaints", protect, adminOnly, getAllComplaints);

router.put("/update-status/:id", protect, adminOnly, updateComplaintStatus);

/* ✅ FIXED ROUTE (IMPORTANT) */
router.put("/assign-officer/:id", protect, adminOnly, assignOfficer);

/* OFFICERS */
router.get("/officers", protect, adminOnly, getAllOfficers);
router.post("/officers", protect, adminOnly, addOfficer);
router.delete("/officers/:id", protect, adminOnly, deleteOfficer);

/* LOCATIONS */
router.get("/locations", protect, adminOnly, getLocations);
router.post("/locations", protect, adminOnly, addLocation);

module.exports = router;