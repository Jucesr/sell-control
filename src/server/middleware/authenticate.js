import {User} from '../models/user'

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then( (user) =>{
    if(!user){
      return Promise.reject({
        message: 'Token has expired',
        html_code: 401
      });
    }

    req.user = user;
    req.token = token;
    next();
  }).catch( e => next({
    ...e,
    html_code: 401
  }));
};

module.exports = {authenticate};
