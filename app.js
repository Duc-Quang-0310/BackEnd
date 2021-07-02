require("dotenv/config");
var cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var port = process.env.PORT || 5000;
app.use(cors());

//import route
const productsRoute = require("./routes/products");
const authRoute = require("./routes/authRoute/auth");
const updateUserInfoRoute = require("./routes/authRoute/updateUserInfo");
const blogRoute = require("./routes/blog");
const receiptRoute = require("./routes/receipts");

// react _ nodejs + expressjs _ postman + mongodb
// anytime use req---> use body-parser
app.use(bodyParser.json());

//Routes
app.get("/", (req, res) => {
  res.send(` We are listening on ${port}`);
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
app.use("/receipts", receiptRoute);
app.use("/blogs", blogRoute);
app.use("/api/user", authRoute);
app.use("/api/updateUserInfo", updateUserInfoRoute);

//listening
app.listen(port, () => console.log(`Lisntening to port ${port}`));
