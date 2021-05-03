const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

router.put("/updateShip", (req, res) => {
  try {
    //variablize
    console.log("req updateShip", req.body);
    const shipCity = req.body.city;
    const shipDistrict = req.body.district;
    const shipsubDistrict = req.body.subDistrict;
    const username = req.body.username;

    //
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
