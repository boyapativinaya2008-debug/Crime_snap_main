const router = require("express").Router();

/* MIDDLEWARE */

const {protect} = require("../middleware/auth.middleware");

const {verifyAdmin} = require("../middleware/admin.middleware");

const upload = require("../middleware/upload.middleware");

/* CONTROLLER */

const complaintController = require(
  "../controllers/complaint.controller"
);

/* CREATE COMPLAINT */

router.post(
  "/",
  protect,
  upload.single("evidence"),
  complaintController.createComplaint
);

/* GET ALL COMPLAINTS */

router.get(
  "/all",
  protect,
  verifyAdmin,
  complaintController.getAllComplaints
);


/* GET MY COMPLAINTS */

router.get(
  "/my",
  protect,
  complaintController.getMyComplaints
);


/* ASSIGN OFFICER */

router.put(
  "/assign/:id",
  protect,
  verifyAdmin,
  complaintController.assignComplaint
);

/* UPDATE STATUS */

router.put(
  "/status/:id",
  protect,
  verifyAdmin,
  complaintController.updateStatus);

module.exports = router;