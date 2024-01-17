var jwt = require('jsonwebtoken');

function auth(req, res, next) {

    if(!req.headers.authorization) {
        return res.status(401).json({
            message: "You are not authorized"
        })
    }

    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, 'this_is_a_secret_key', function(err, decoded) {
        if(err == null) {
            next()
        } else {
            return res.status(401).json({
                message: "You are not authorized"
            })
        }
    });
}

module.exports = auth;