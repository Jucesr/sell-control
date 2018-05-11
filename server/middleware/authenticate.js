var {User} = require('../models/user');

const error_token_expired = {
  error: 'Token has expired'
}

const error_unauthorized = {
  error: 'You are not allow to do this'
}

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then( (user) =>{
    if(!user){
      return Promise.reject(error_token_expired);
    }

    req.user = user;
    req.token = token;
    next();
  }).catch( (e) => {
    res.status(401).send(e);
  });
};

module.exports = {authenticate};
