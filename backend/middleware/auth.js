var jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const authData = jwt.verify(token, "this_is_a_secret_key");

    req.authData = authData;

    next();
  } catch (e) {
    res.status(401).json({
      message: "You are not authenticated !!!",
    });
  }
}

module.exports = auth;
