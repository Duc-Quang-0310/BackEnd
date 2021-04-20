const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  chip: {
    type: String,
    require: true,
  },
  screen: {
    type: String,
    require: true,
  },
  color: {
    type: String,
    require: true,
  },
  ram: {
    type: String,
    require: true,
  },
  card: {
    type: String,
    require: true,
  },
  storage: {
    type: String,
    require: true,
  },
  pin: {
    type: String,
    require: true,
  },
  weight: {
    type: String,
    require: true,
  },
  window: {
    type: String,
    require: true,
  },
  imageLink: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Products", productSchema);
