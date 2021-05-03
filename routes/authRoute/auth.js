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
    return res.status(400).send("Username has already existed");
  if (emailExist) return res.status(400).send("Email has already existed");

  //step 2: create a email to send and then send it to userinput mail
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
      subject: `Active account  ${username} on Computadora`,
      html: ` <a href="http://localhost:3000/activateAccount/${AllInfomationInToken}">Bấm vào đây để bắt đẩu kích hoạt tài khoản tại Computadora và sử dụng</a>`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email activate account has been send");
      }
    });
    res.json({ success: true, message: "Successfully activate your account" });
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
    const user = new User({
      name: username,
      username: username,
      email: email,
      password: hashedPW,
      isAdmin: false,
      isConfirmed: true,
    });

    const savedUser = await user.save();
    console.log("saved user", savedUser);
    res.send("saved");
  } catch (error) {
    console.log(error);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username });
    console.log(username);

    // username exist proceed further step
    if (!user) return res.status(400).send("Username or password Wrong");
    if (!user.isConfirmed)
      return res.status(400).send("Please check your mail to active account");

    // valid pw
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(400).send("Password does not match, re-enter please");
    }

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

//LOGIN WITH GOOGLE

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
  if (!usernameExist) {
    res.json("Tài khoản này không tồn tại vui lòng đăng ký ");
  } else {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

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
        subject: `Confirmation recover password for ${username} on Computadora`,
        html: ` <a href="http://localhost:3000/confirmPasswordRecover/${AllInfomationInToken}"> Bấm vào đây để xác nhận rằng chính là BẠN đang muốn lấy lại mật khẩu</a>`,
      };
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email recover password has been send");
        }
      });
    } catch (error) {
      console.log(error);
    }
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
