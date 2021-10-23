const express = require("express");
const router = express.Router();
const blog = require("../models/blog");

// xem

router.get("/", async (req, res) => {
  try {
    const blogs = await blog.find({});
    res.json({ data: blogs, success: true });
  } catch (error) {
    res.json({ data: "", success: false });
  }
});

//add
router.post("/", async (req, res) => {
  console.log(req.body);
  const Blog = new blog({
    headline: req.body.headline,
    imgHeadline: req.body.imgHeadline,
    blog: req.body.blog,
  });
  try {
    const savedBlog = await Blog.save();
    res.json(savedBlog);
  } catch (error) {
    res.json(error);
  }
});

// xem 1 sp qua id
router.get("/:BlogId", async (req, res) => {
  try {
    const Blog = await blog.findById(req.params.BlogId);
    res.json({ data: Blog, success: true });
  } catch (err) {
    res.json(err);
  }
});

// //delete
router.delete("/:BlogId", async (req, res) => {
  try {
    const removeBlog = await blog.remove({ _id: req.params.BlogId });
    res.json(removeBlog);
  } catch (err) {
    res.json({ message: err });
  }
});

// //update

router.patch("/:BlogId", async (req, res) => {
  try {
    const updateBlog = await blog.updateOne(
      { _id: req.params.BlogId },
      {
        $set: {
          headline: req.body.headline,
          imgHeadline: req.body.imgHeadline,
          blog: req.body.blog,
        },
      }
    );
    res.json(updateBlog);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
