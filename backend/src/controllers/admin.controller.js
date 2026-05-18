const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const Complaint = require("../models/complaint.model");
const Officer = require("../models/officer.model");
const Location = require("../models/location");


/* ================= ADMIN LOGIN ================= */
const adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    /* VALIDATION */

    if (!email || !password) {

      return res.status(400).json({
        message: "Email and password required",
      });
    }

    /* FIND ADMIN */

    const admin = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!admin || admin.role !== "admin") {

      return res.status(400).json({
        message: "Admin not found",
      });
    }

    /* BLOCK CHECK */

    if (admin.status === "Blocked") {

      return res.status(403).json({
        message: "Your account is blocked",
      });
    }

    /* PASSWORD CHECK */

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Wrong password",
      });
    }

    /* TOKEN */

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    /* RESPONSE */

    res.status(200).json({

      token,

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
/* ================= GET USERS ================= */

const getAllUsers = async (req, res) => {

  try {

    const users = await User.find({
      role: "user",
    }).select("-password");

    res.status(200).json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================= DELETE USER ================= */
 
const deleteUser = async (req, res) => {

  try {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid ID",
  });
}
    const user = await User.findById(
      req.params.id
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {

      return res.status(403).json({
        message: "Cannot delete admin",
      });
    }


    await User.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================= BLOCK USER ================= */

const blockUser = async (req, res) => {

  try {

    const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        {
          status: "Blocked",
        },

        {
          new: true,
        }
      );

    res.status(200).json({
      msg: "Blocked",
      user: updatedUser,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= UNBLOCK USER ================= */

const unblockUser = async (req, res) => {

  try {

    const updatedUser =
      await User.findByIdAndUpdate(

        req.params.id,

        {
          status: "Active",
        },

        {
          new: true,
        }
      );

    res.status(200).json({
      msg: "Unblocked",
      user: updatedUser,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= UPDATE STATUS ================= */

const updateComplaintStatus = async (req, res) => {

  try {
if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid ID",
  });
}
    const { status } = req.body;

    const allowed = [
      "Pending",
      "In Progress",
      "Resolved",
    ];

    if (!allowed.includes(status)) {

      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const complaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!complaint) {

      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      complaint,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/* ================= ASSIGN OFFICER ================= */
/* ================= ASSIGN OFFICER ================= */

const assignOfficer = async (req, res) => {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {

      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    const { officer } = req.body;

    if (!officer) {

      return res.status(400).json({
        message: "Officer required",
      });
    }

    /* FIND COMPLAINT */

    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {

      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    /* UPDATE COMPLAINT */

    complaint.assignedOfficer = officer;

    complaint.status = "In Progress";

    await complaint.save();

    /* UPDATE OFFICER ACTIVE CASES */

    const officerData = await Officer.findOne({
      name: officer,
    });

    if (officerData) {

      officerData.activeCases =
        (officerData.activeCases || 0) + 1;

      await officerData.save();
    }

    res.status(200).json({

      message: "Officer Assigned",

      complaint,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
/* ================= OFFICERS ================= */

const getAllOfficers = async (req, res) => {

  try {

    const officers = await Officer.find();

    res.json(officers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const addOfficer = async (req, res) => {

  try {

    const officer = await Officer.create(
      req.body
    );

    res.status(201).json(officer);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteOfficer = async (req, res) => {

  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid ID",
      });
    }

    await Officer.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Officer deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= LOCATIONS ================= */

const getLocations = async (req, res) => {

  try {

    const locations = await Location.find();

    res.json(locations);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

const addLocation = async (req, res) => {

  try {

    const location = await Location.create(
      req.body
    );

    res.status(201).json(location);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
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
};