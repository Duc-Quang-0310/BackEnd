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
    require: true,
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
    default: "",
  },
  shipCity: {
    type: String,
    default: "",
  },
  shipDistrict: {
    type: String,
    default: "",
  },
  shipSubDistrict: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/dsykf3mo9/image/upload/v1619363046/ProductImage/icons8-male-user-100_jgukfa.png",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
