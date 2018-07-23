'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate_company = undefined;

var _company = require('../models/company');

var _helpers = require('../helpers');

var validate_company = exports.validate_company = function validate_company(req, res, next) {
  var user = req.user;

  if (!user.selected_company_id || user.selected_company_id == null) {
    return next({
      message: 'User does not belong to any company',
      html_code: 401
    });
  }
  _company.Company.findById(user.selected_company_id).then(function (doc) {
    if (!doc) {
      user.removeCompany(user.selected_company_id);
      return next({
        message: 'Company does not exists anymore',
        html_code: 404
      });
    }
    var result = doc.users.find(function (u) {
      return u.equals(user._id);
    });
    if (!result) {
      return next({
        message: 'User does not belong to that company',
        html_code: 401
      });
    }
    req.body.company_id = user.selected_company_id;
    req.company = doc;
    next();
  });
};
//# sourceMappingURL=validate_company.js.map