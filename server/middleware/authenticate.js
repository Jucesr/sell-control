'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _user = require('../models/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var error_token_expired = {
  message: 'Token has expired',
  html_code: 401
};

var error_unauthorized = {
  error: 'You are not allow to do this',
  html_code: 401
};

var authenticate = function authenticate(req, res, next) {
  var token = req.header('x-auth');

  _user.User.findByToken(token).then(function (user) {
    if (!user) {
      return _promise2.default.reject(error_token_expired);
    }

    req.user = user;
    req.token = token;
    next();
  }).catch(function (e) {
    return next(e);
  });
};

module.exports = { authenticate: authenticate };
//# sourceMappingURL=authenticate.js.map