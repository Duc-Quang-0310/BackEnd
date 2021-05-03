const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
    default: "Viet Nam la so 1",
    max: 333,
  },
  username: {
    type: String,
    require: true,
    min: 6,
    max: 12,
  },
  email: {
    type: String,
    min: 6,
    max: 333,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 333,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  mobilePhone: {
    type: String,
  },
  shipCity: {
    type: String,
  },
  shipDistrict: {
    type: String,
  },
  shipSubDistrict: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
