const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  userID: {
    type: String,
    require: true,
  },
  cart: {
    type: Array,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Receipts", receiptSchema);
