const express = require("express");
const User = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", (req, res, next) => {
  const saltRounds = 10;
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
            user: createdUser,
          },
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: error.message,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  // bcrypt.compare()
  let fetchedUser;

  User.findOne({ email: req.body.email })
    .then((result) => {
      if (result == null) {
        throw new Error("Email not found !!!");
      }
      fetchedUser = result;
      return result.password;
    })
    .then((hashedPassowrd) => {
      bcrypt
        .compare(req.body.password, hashedPassowrd)
        .then((result) => {
          //generate jwt token and return
          return result;
        })
        .then((isAuthenticated) => {
          if (isAuthenticated) {
            jwt.sign(
              {
                email: req.body.email,
                userId: fetchedUser._id,
              },
              "this_is_a_secret_key",
              { expiresIn: "60000" },
              (err, token) => {
                return res.status(200).json({
                  token: "Bearer " + token,
                  expiresIn: "60000",
                  timestamp: new Date(),
                });
              }
            );
          } else {
            res.status(400).json({
              message: "Inccorect Password",
            });
          }
        });
    })
    .catch((error) => {
      res.status(400).json({
        message: error.message,
      });
    });
});

module.exports = router;
