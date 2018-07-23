import {User} from '../models/user'

const error_token_expired = {
  message: 'Token has expired',
  html_code: 401
}

const error_unauthorized = {
  error: 'You are not allow to do this',
  html_code: 401
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
  }).catch( e => next(e));
};

module.exports = {authenticate};
