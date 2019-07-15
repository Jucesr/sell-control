const errors = require('../config/errors')
const async_handler = require('express-async-handler')
const User = require('../models/user');

let error_objet = {
  isCustomError: true,
  html_code: 401,
  body: errors.MISSING_TOKEN
}

const authenticate = async_handler (async (req, res, next) => {
  let token ;

  //  Check if token was provided
  if(!req.header('Authorization')){
    return next(error_objet)
  }

  const parts = req.header('Authorization').split(' ');

  if (parts.length !== 2) {
    return next(error_objet)
  }

  const scheme = parts[0];
  const credentials = parts[1];

  if (/^Bearer$/.test(scheme)) {
    token = credentials;
  } else {
    return next(error_objet)
  }

  //  Check if the token belongs to the user.

  const user = await User.findByToken(token)

  req.user = user;
    
  next();

  })


module.exports = authenticate;
