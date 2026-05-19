const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

module.exports = (db, protect, officerOnly) => {

  // =========================
  // GET OFFICER DASHBOARD (ASSIGNED COMPLAINTS)
  // =========================
  router.get("/:officerId", protect, officerOnly, async (req, res) => {
    try {
      const complaints = await db
        .collection("complaints")
        .find({
          assignedOfficer: req.params.officerId,
        })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(complaints);
    } catch (err) {
      console.error("Officer complaints error:", err);
      res.status(500).json({
        msg: "Failed to fetch complaints",
      });
    }
  });

  // =========================
  // UPDATE COMPLAINT STATUS
  // =========================
  router.put("/status/:id", protect, officerOnly, async (req, res) => {
    try {
      const { status } = req.body;

      const updated = await db
        .collection("complaints")
        .findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              status,
              updatedAt: new Date(),
            },
          },
          { returnDocument: "after" }
        );

      if (!updated.value) {
        return res.status(404).json({
          msg: "Complaint not found",
        });
      }

      res.json(updated.value);
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({
        msg: "Failed to update status",
      });
    }
  });

  return router;
};