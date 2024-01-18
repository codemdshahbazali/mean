var jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, "this_is_a_secret_key");
    
    next();
  } catch (e) {
    res.status(401).json({
      message: "You are not authorized.",
      error: e.message,
    });
  }
}

module.exports = auth;
