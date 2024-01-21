var jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const authData = jwt.verify(token, process.env.JWT_KEY);

    req.authData = authData;

    next();
  } catch (e) {
    res.status(401).json({
      message: "You are not authenticated !!!",
    });
  }
}

module.exports = auth;
