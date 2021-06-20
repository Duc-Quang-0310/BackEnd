const express = require("express");
const router = express.Router();
const product = require("../models/product");

// xem
router.get("/", async (req, res) => {
  try {
    const products = await product.find();
    res.json(products);
  } catch (err) {
    res.json({ message: err });
  }
});

// them
router.post("/", async (req, res) => {
  const Product = new product({
    name: req.body.name,
    chip: req.body.chip,
    screen: req.body.screen,
    color: req.body.color,
    ram: req.body.ram,
    card: req.body.card,
    storage: req.body.storage,
    pin: req.body.pin,
    connection: req.body.connection,
    weight: req.body.weight,
    window: req.body.window,
    review: req.body.review,
    imgs: req.body.imgs,
    price: req.body.price,
  });
  try {
    const savedProduct = await Product.save();
    res.json(savedProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

// xem 1 sp qua id
router.get("/:ProductId", async (req, res) => {
  try {
    const Product = await product.findById(req.params.ProductId);
    res.json(Product);
  } catch (err) {
    res.json({ message: err });
  }
});

//delete
router.delete("/:ProductId", async (req, res) => {
  try {
    const removeProduct = await product.remove({ _id: req.params.ProductId });
    res.json(removeProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

//update

router.patch("/:ProductId", async (req, res) => {
  try {
    const updateProduct = await product.updateOne(
      { _id: req.params.ProductId },
      {
        $set: {
          name: req.body.name,
          chip: req.body.chip,
          screen: req.body.screen,
          color: req.body.color,
          ram: req.body.ram,
          card: req.body.card,
          storage: req.body.storage,
          pin: req.body.pin,
          connection: req.body.connection,
          weight: req.body.weight,
          window: req.body.window,
          review: req.body.review,
          imgs: req.body.imgs,
          price: req.body.price,
        },
      }
    );
    res.json(updateProduct);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
