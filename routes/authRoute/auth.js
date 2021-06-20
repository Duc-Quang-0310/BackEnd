const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");

//REGISTER
// router.post("/register", async (req, res) => {
//   //check username
//   const usernameExist = await User.findOne({ username: req.body.username });
//   if (usernameExist)
//     return res.status(400).send("Username has already existed");

//   //Hash pw
//   const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
//   const hashedPW = await bcrypt.hash(req.body.password, decryptPW);

//   const user = new User({
//     name: req.body.username,
//     username: req.body.username,
//     email: req.body.email,
//     password: hashedPW,
//     isAdmin: false,
//     isConfirmed: false,
//   });

//   try {
//     const savedUser = await user.save();
//     res.send(savedUser);
//   } catch (error) {
//     res.status(400).send(err);
//   }
// });

//REGISTER WITH EMAIL
router.post("/sendUserInfoToRegisterDB", async (req, res) => {
  console.log(" sendUserInfoToRegisterDB data", req.body);
  //step 1: check username and mail
  const usernameExist = await User.findOne({ username: req.body.username });
  const emailExist = await User.findOne({ email: req.body.email });

  if (usernameExist)
    return res.status(400).send("Tên người dùng đã tồn tại rồi bạn ơi!");
  if (emailExist)
    return res
      .status(400)
      .send("email này đã được dùng để đăng ký tài khoản khác rồi bạn ơi!");

  //variablize
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const AllInfomationInToken = jwt.sign(
    {
      username,
      password,
      email,
    },
    process.env.TOKEN_SECRET
  );

  const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
  const hashedPW = await bcrypt.hash(password, decryptPW);

  const user = new User({
    name: username,
    username: username,
    email: email,
    password: hashedPW,
    isAdmin: false,
    isConfirmed: false,
  });

  //step 2: create a email to send and then send it to userinput mail

  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "computadora.fullservice@gmail.com",
        pass: "DucQuang11a6",
      },
    });
    let mailOptions = {
      from: "computadora.fullservice@gmail.com",
      to: email,
      subject: `Active account  ${username} on Computadora`,
      html: ` <a href="http://localhost:3000/activateAccount/${AllInfomationInToken}">Bấm vào đây để bắt đẩu kích hoạt tài khoản tại Computadora và sử dụng</a>`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err });
      } else {
        console.log("Email activate account has been send");
        await user.save();
        res.json({
          success: true,
          message:
            "Thư kích hoạt tài khoản đã được gửi (bạn nhớ kiểm tra cả thư rác nhé 😚)",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/registerConfirm/:token", async (req, res) => {
  try {
    //step1: decoded
    console.log(
      "data receive from put Router sendUserInfoToRegisterDB",
      req.params
    );
    const registerDetailsInformationHasBeenDecoded = await jwt.verify(
      req.params.token,
      process.env.TOKEN_SECRET
    );

    //step2: store in variables
    const username = registerDetailsInformationHasBeenDecoded.username;
    const password = registerDetailsInformationHasBeenDecoded.password;
    const email = registerDetailsInformationHasBeenDecoded.email;
    console.log("username from sendUserInfoToRegisterDB", username);
    console.log("password from sendUserInfoToRegisterDB", password);
    console.log("email from sendUserInfoToRegisterDB", email);

    //step 3: hashed PW
    const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
    const hashedPW = await bcrypt.hash(password, decryptPW);

    //step 4: lets update in our database
    const filter = { username };
    const updateAccount = {
      username: username,
      email: email,
      password: hashedPW,
      isAdmin: false,
      isConfirmed: true,
    };

    const user = await User.findOneAndUpdate(filter, updateAccount, {
      new: true,
    });

    console.log("User được lưu vào db", user);
    res.json({
      success: true,
      message:
        " Tài khoản đã được kích hoạt, chúc bạn có trải nghiệm thật vui vẻ tại Computadora 😜 ",
    });
  } catch (error) {
    console.log(error);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username });
  console.log(username);

  // username exist proceed further step
  if (!user) return res.status(400).send("Sai tài khoản hoặc mật khẩu nhé");
  if (!user.isConfirmed)
    return res
      .status(400)
      .send(
        "Bạn hãy kiểm tra lại hòm thư điện tử, chúng mình đã gửi thư rồi bạn kích hoạt đi nhé <3"
      );
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).send("Sai tài khoản hoặc mật khẩu nhé");
  }
  try {
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.json({
      token,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});

//RECOVER PASSWORD
// router.put("/pwrecover", async (req, res) => {
//   console.log("data from FE", req.body);
//   const username = req.body.username;
//   const password = req.body.password;
//   try {
//     const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
//     const hashedPW = await bcrypt.hash(password, decryptPW);

//     const filter = { username };

//     const updateAccount = {
//       username: req.body.username,
//       password: hashedPW,
//       isAdmin: false,
//     };

//     const user = await User.findOneAndUpdate(filter, updateAccount, {
//       new: true,
//     });

//     res.json({ user });
//   } catch (error) {
//     console.log(error);
//   }
// });

// PW RECOVER WITH EMAIL

router.post("/pwRecoverSendRequestToBackEnd", async (req, res) => {
  const usernameExist = await User.findOne({ username: req.body.username });
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (!usernameExist) {
    res
      .status(400)
      .send("Tài khoản này không tồn tại vui lòng đăng ký bạn ei 🤭 ");
  }
  if (usernameExist.email != email) {
    res
      .status(400)
      .send("Email không được liên kết với tài khoản này nhé bạn 😓 ");
  }
  const AllInfomationInToken = jwt.sign(
    {
      usernameExist: usernameExist._id,
      username,
      password,
      email,
    },
    process.env.TOKEN_SECRET
  );

  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.ADMINEMAIL_SECRET,
        pass: process.env.PASSWORDEMAIL_SECRET,
      },
    });
    let mailOptions = {
      from: process.env.ADMINEMAIL_SECRET,
      to: email,
      subject: `Khôi phục lại mật khẩu cho tài khoản ${username} on Computadora`,
      html: ` <a href="http://localhost:3000/confirmPasswordRecover/${AllInfomationInToken}"> Bấm vào đây để xác nhận rằng chính là BẠN đang muốn lấy lại mật khẩu</a>`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email recover password has been send");
      }
    });
    res.json({
      success: true,
      message:
        "Thư kích hoạt tài khoản đã được gửi hãy kiểm tra trong hòm thư của bạn ( kiểm tra cả thư rác nhe bạn ❤️ )",
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/pwRecoverConfirmation/:token", async (req, res) => {
  try {
    //step1: decoded
    console.log(
      "data receive from put Router pwRecoverSendRequestToBackEnd",
      req.params
    );
    const passworRecoverDetailsInformationHasBeenDecoded = await jwt.verify(
      req.params.token,
      process.env.TOKEN_SECRET
    );

    //step2: store in variables
    const username = passworRecoverDetailsInformationHasBeenDecoded.username;
    const password = passworRecoverDetailsInformationHasBeenDecoded.password;
    const email = passworRecoverDetailsInformationHasBeenDecoded.email;
    const filter = { username };

    //step 3: hashed PW
    const decryptPW = await bcrypt.genSalt(10); // generate random string and mix them
    const hashedPW = await bcrypt.hash(password, decryptPW);

    //step 4: lets update in our database
    const updateAccount = {
      username: username,
      email: email,
      password: hashedPW,
      isAdmin: false,
      isConfirmed: true,
    };

    const user = await User.findOneAndUpdate(filter, updateAccount, {
      new: true,
    });

    //step 5: respone
    res.json({ user });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
