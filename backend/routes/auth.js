const express = require("express");
const User = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", (req, res, next) => {
  const saltRounds = 10; //higher value it is, longer it takes to encrypt but it is more secure
  bcrypt.hash(req.body.password, saltRounds).then((hashedPassowrd) => {
    const user = new User({
      email: req.body.email,
      password: hashedPassowrd,
    });

    user
      .save()
      .then((createdUser) => {
        res.status(201).json({
          post: {
            message: "User created!",
            user: createdUser,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  // bcrypt.compare()
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user == null) {
        throw new Error("Email not found !!!");
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((isAuthenticated) => {
      if (!isAuthenticated) {
        return res.status(400).json({
          message: "Inccorect Password",
        });
      }

      const token = jwt.sign(
        { email: req.body.email, userId: fetchedUser._id },
        "this_is_a_secret_key",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        userId: fetchedUser._id,
        token: "Bearer " + token,
        expiresIn: "36000000",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
});

module.exports = router;
