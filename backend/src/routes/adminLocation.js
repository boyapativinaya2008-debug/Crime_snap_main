const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const { ObjectId } = require("mongodb");

const {
  protect
} = require("../middleware/auth.middleware");

const {
  verifyAdmin
} = require("../middleware/admin.middleware");

/* GET ALL LOCATIONS */

router.get(
  "/",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const db = mongoose.connection.db;

      const locations = await db
        .collection("locations")
        .find()
        .sort({
          createdAt: -1
        })
        .toArray();

      res.status(200).json(
        locations
      );

    } catch (err) {

      res.status(500).json({
        msg: err.message
      });
    }
  }
);

/* GET SINGLE LOCATION */

router.get(
  "/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const db = mongoose.connection.db;

      const location = await db
        .collection("locations")
        .findOne({
          _id: new ObjectId(
            req.params.id
          )
        });

      if (!location) {

        return res.status(404).json({
          msg: "Location not found"
        });
      }

      res.status(200).json(
        location
      );

    } catch (err) {

      res.status(500).json({
        msg: err.message
      });
    }
  }
);

/* CREATE LOCATION */

router.post(
  "/",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const db = mongoose.connection.db;

      const {
        stationName,
        area,
        city,
        state,
        pincode
      } = req.body;

      if (
        !stationName ||
        !area ||
        !city ||
        !state ||
        !pincode
      ) {

        return res.status(400).json({
          msg: "All fields required"
        });
      }

      await db
        .collection("locations")
        .insertOne({
          stationName,
          area,
          city,
          state,
          pincode,
          createdAt: new Date()
        });

      res.status(201).json({
        msg: "Location added successfully"
      });

    } catch (err) {

      res.status(500).json({
        msg: err.message
      });
    }
  }
);

/* UPDATE LOCATION */

router.put(
  "/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const db = mongoose.connection.db;

      const {
        stationName,
        area,
        city,
        state,
        pincode
      } = req.body;

      if (
        !stationName ||
        !area ||
        !city ||
        !state ||
        !pincode
      ) {

        return res.status(400).json({
          msg: "All fields required"
        });
      }

      await db
        .collection("locations")
        .updateOne(
          {
            _id: new ObjectId(
              req.params.id
            )
          },
          {
            $set: {
              stationName,
              area,
              city,
              state,
              pincode,
              updatedAt: new Date()
            }
          }
        );

      res.status(200).json({
        msg: "Location updated"
      });

    } catch (err) {

      res.status(500).json({
        msg: err.message
      });
    }
  }
);

/* DELETE LOCATION */

router.delete(
  "/:id",
  protect,
  verifyAdmin,
  async (req, res) => {

    try {

      const db = mongoose.connection.db;

      await db
        .collection("locations")
        .deleteOne({
          _id: new ObjectId(
            req.params.id
          )
        });

      res.status(200).json({
        msg: "Location deleted"
      });

    } catch (err) {

      res.status(500).json({
        msg: err.message
      });
    }
  }
);

module.exports = router;