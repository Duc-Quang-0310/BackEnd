const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

router.put("/updateShip", async (req, res) => {
  try {
    //variablize
    console.log("req updateShip", req.body);
    const shipCityFromRequest = req.body.city;
    const shipDistrictFromRequest = req.body.district;
    const shipsubDistrictFromRequest = req.body.subDistrict;
    const username = req.body.username;
    const user = await User.findOne({ username });
    console.log("user info have from backend", user);
    const filter = { username };

    //update info
    const informationForUpdatedAccount = {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
      isConfirmed: user.isConfirmed,
      mobilePhone: user.mobilePhone,
      shipCity: shipCityFromRequest,
      shipDistrict: shipDistrictFromRequest,
      shipSubDistrict: shipsubDistrictFromRequest,
      imageUrl: user.imageUrl,
      date: user.date,
    };

    // lets update
    const updatedUser = await User.findOneAndUpdate(
      filter,
      informationForUpdatedAccount,
      { new: true }
    );

    //now respone to user
    res.json({
      success: true,
      message: "Cập nhật địa chỉ giao hàng thành công",
    });

    //
  } catch (error) {
    res.json(error);
  }
});

router.put("/updatePassWord", async (req, res) => {
  console.log("req.body from update password", req.body);
  const password = req.body.password;
  const username = req.body.username;
  const newPassword = req.body.newPassword;

  //find user and filter it
  const user = await User.findOne({ username });
  const filter = { username };

  //decrypt if password is correct or not
  const validPassword = await bcrypt.compare(password, user.password);
  console.log("validPassword from updatePassWord", validPassword);
  if (!validPassword)
    return res
      .status(400)
      .send("Mật khẩu không đúng với tài khoản mời bạn nhập lại");
  //encrypt
  const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
  const hashedPW = await bcrypt.hash(newPassword, decryptPW);

  //update info
  const informationForUpdatedAccount = {
    name: user.name,
    username: user.username,
    email: user.email,
    password: hashedPW,
    isAdmin: user.isAdmin,
    isConfirmed: user.isConfirmed,
    mobilePhone: user.mobilePhone,
    shipCity: user.shipCity,
    shipDistrict: user.shipDistrict,
    shipSubDistrict: user.shipSubDistrict,
    imageUrl: user.imageUrl,
    date: user.date,
  };

  try {
    const updatedUser = await User.findOneAndUpdate(
      filter,
      informationForUpdatedAccount,
      { new: true }
    );
    console.log(updatedUser);
    res.json({
      success: true,
      message: "Cập nhật mật khẩu thành công",
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
