const express = require("express");
const router = express.Router();
const receipt = require("../models/receipt");

router.get("/", async (req, res) => {
  try {
    const allReceipts = await receipt.find();
    res.json(allReceipts);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/:userID", async (req, res) => {
  try {
    const receipt_withUserId = await receipt.find({
      userID: req.params.userID,
    });
    res.json(receipt_withUserId);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  console.log("req body from receipts", req.body);
  var today = new Date();
  var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  let userID = req.body.userID;
  let cart = req.body.cart;

  const Receipt = new receipt({
    userID,
    cart,
    date,
  });

  try {
    const savedReceipt = await Receipt.save();
    res.json(savedReceipt);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
