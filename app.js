var cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(cors());
//import route
require("dotenv/config");
const productsRoute = require("./routes/products");
const authRoute = require("./routes/authRoute/auth");
const postRoute = require("./routes/authRoute/post");
const updateUserInfoRoute = require("./routes/authRoute/updateUserInfo");

// react _ nodejs + expressjs _ postman + mongodb
// anytime use req---> use body-parser
app.use(bodyParser.json());

//Routes
app.get("/", (req, res) => {
  res.send(" We are on localhost::5000");
});

//connect to db
mongoose.connect(
  process.env.MongoDB_Connection,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use("/products", productsRoute);
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/updateUserInfo", updateUserInfoRoute);

//listening
app.listen(5000, () => console.log("Lisntening to port 5000"));
