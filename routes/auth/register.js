var express = require("express");
var { hashPassword, sendWelcomeEmail } = require("../../utils");
const UsersDatabase = require("../../models/User");
var router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, country } = req.body;

  //   check if any user has that username
  const user = await UsersDatabase.findOne({ email });

  // if user exists
  if (user) {
    res.status(400).json({
      success: false,
      message: "email address is already taken",
    });
    return;
  }

  await UsersDatabase.create({
    firstName,
    lastName,
    email,
    password: hashPassword(password),
    country,
    amountDeposited: 0,
    profit: 0,
    balance: 0,
    referalBonus: 0,
    transactions: [],
    withdrawals: [],
    accounts: {
      eth: {
        address: "",
      },
      ltc: {
        address: "",
      },
      btc: {
        address: "",
      },
      usdt: {
        address: "",
      },
    },
    verified: false,
    isDisabled: false,
  })
    .then((data) => {
      return res.json({ code: "Ok", data: user });
    })
    .then(() => {
      var token = uuidv4();
      sendWelcomeEmail({ to: req.body.email, token });
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    });
});

module.exports = router;
