const jwt = require('jsonwebtoken');
const {JWT_SECRET, TOKEN_EXPIRATION} = process.env;

const issue = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
const verify = (token, cb) => jwt.verify(token, JWT_SECRET, {}, cb);


module.exports = {
    issue,
    verify
};
