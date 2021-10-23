const express = require("express");
const router = express.Router();
const receipt = require("../models/receipt");

router.get("/", async (req, res) => {
  try {
    const allReceipts = await receipt.find();
    res.json({ data: allReceipts, success: true });
  } catch (error) {
    res.json({ error: error, success: false });
  }
});

router.get("/:userID", async (req, res) => {
  try {
    const receipt_withUserId = await receipt.find({
      userID: req.params.userID,
    });
    res.json({ data: receipt_withUserId, success: true });
  } catch (error) {
    res.status(500).json({ error: error, success: false });
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
    res.json({ data: savedReceipt, success: true });
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
});

module.exports = router;
