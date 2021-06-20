const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  headline: {
    type: String,
    require: true,
  },
  imgHeadline: {
    type: Array,
    require: true,
  },
  blog: {
    type: Array,
    require: true,
  },
});

module.exports = mongoose.model("Blogs", blogSchema);
