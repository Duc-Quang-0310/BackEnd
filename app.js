var cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(cors());

require("dotenv/config");

// react _ nodejs + expressjs _ postman + mongodb
// anytime use req---> use body-parser
app.use(bodyParser.json());

// import route
const productsRoute = require("./routes/products");
app.use("/products", productsRoute);

//Routes
app.get("/", (req, res) => {
  res.send(" We are on localhost::5000");
});

//connect to db
mongoose.connect(
  process.env.MongoDB_Connection,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//listening
app.listen(5000);
