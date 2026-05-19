const mongoose = require("mongoose");

const officerSchema =
  new mongoose.Schema(

    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      badgeNumber: {
        type: String,
        required: true,
        unique: true,
      },

      station: {
        type: String,
        required: true,
      },

      rank: {
        type: String,
        required: true,
      },
      role: {
         type: String,
         default: "officer",
      },

      status: {

        type: String,

        enum: [
          "Active",
          "Inactive",
        ],

        default: "Active",
      },

      activeCases: {
        type: Number,
        default: 0,
      },
      maxCapacity: {
  type: Number,
  default: 5,
},
    },

    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Officer",
  officerSchema
);