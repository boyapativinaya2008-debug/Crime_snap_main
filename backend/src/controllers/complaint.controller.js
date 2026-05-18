const Complaint = require("../models/complaint.model");

/* ===============================
   CREATE COMPLAINT
=============================== */

const createComplaint = async (req, res) => {

  try {

    const {
      title,
      category,
      location,
      description,
    } = req.body;

    const complaint = new Complaint({

      title,
      category,
      location,
      description,

      evidence: req.file
        ? req.file.filename
        : "",

      user: req.user.id,

      status: "Pending",

    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });

  } catch (error) {

    console.log("CREATE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===============================
   GET ALL COMPLAINTS
=============================== */

const getAllComplaints = async (req, res) => {

  try {

    const complaints = await Complaint.find()

      .populate(
        "user",
        "name email"
      )

      .sort({
        createdAt: -1,
      });

    res.status(200).json(
      complaints
    );

  } catch (error) {

    console.log(
      "GET ALL ERROR:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ===============================
   GET MY COMPLAINTS
=============================== */

const getMyComplaints = async (req, res) => {

  try {

    const complaints =
      await Complaint.find({
        user: req.user.id,
      })

      .sort({
        createdAt: -1,
      });

    res.status(200).json(
      complaints
    );

  } catch (error) {

    console.log(
      "GET MY ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===============================
   ASSIGN COMPLAINT
=============================== */

const assignComplaint = async (req, res) => {

  try {

    const {
      assignedOfficer,
    } = req.body;

    if (!assignedOfficer) {

      return res.status(400).json({
        message:
          "Officer name required",
      });
    }

    const updated =
      await Complaint.findByIdAndUpdate(

        req.params.id,

        {
          assignedOfficer,
          status: "In Progress",
        },

        {
          new: true,
        }
      );

    if (!updated) {

      return res.status(404).json({
        message:
          "Complaint not found",
      });
    }

    res.status(200).json({

      message:
        "Officer assigned successfully",

      complaint:
        updated,
    });

  } catch (err) {

    console.log(
      "ASSIGN ERROR:",
      err
    );

    res.status(500).json({
      error:
        err.message,
    });
  }
};

/* ===============================
   UPDATE STATUS
=============================== */

const updateStatus = async (req, res) => {

  try {

    const { status } =
      req.body;

    const allowed = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (
      !allowed.includes(
        status
      )
    ) {

      return res.status(400).json({
        message:
          "Invalid status",
      });
    }

    const updated =
      await Complaint.findByIdAndUpdate(

        req.params.id,

        {
          status,
        },

        {
          new: true,
        }
      );

    if (!updated) {

      return res.status(404).json({
        message:
          "Complaint not found",
      });
    }

    res.status(200).json({

      message:
        "Status updated successfully",

      complaint:
        updated,
    });

  } catch (err) {

    console.log(
      "STATUS ERROR:",
      err
    );

    res.status(500).json({
      error:
        err.message,
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateStatus,
  assignComplaint,
};