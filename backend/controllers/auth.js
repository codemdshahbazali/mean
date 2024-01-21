const User = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = (req, res, next) => {
  const saltRounds = 10; //higher value it is, longer it takes to encrypt but it is more secure
  bcrypt.hash(req.body.password, saltRounds).then((hashedPassword) => {
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    user
      .save()
      .then((createdUser) => {
        res.status(201).json({
          post: {
            message: "User created!!!",
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Email already exists!!!",
        });
      });
  });
};

exports.loginUser = (req, res, next) => {
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
          message: "Incorrect Password !!!",
        });
      }

      const token = jwt.sign(
        { email: req.body.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        userId: fetchedUser._id,
        token: "Bearer " + token,
        expiresIn: "36000000",
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).json({
        message: error.message,
      });
    });
};
