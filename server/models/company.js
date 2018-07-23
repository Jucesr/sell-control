'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _pre_trim = require('../middleware/pre_trim');

var _user = require('./user');

var _client = require('./client');

var _product = require('./product');

var _supplier = require('./supplier');

var _sale = require('./sale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CompanySchema = new _mongoose2.default.Schema({
  user_owner_id: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  users: [{
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User'
  }],
  max_users: {
    type: Number,
    default: 2
  },
  name: {
    type: String,
    required: true
  }
});

CompanySchema.methods.unsubscribeOtherUser = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ut, uu_id) {
    var company, ut_id, company_id, user_owner_id, result, uu;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /*
              -Unsubscribe an user from a company
                -Actors
              * UT - User that triggers the action.
              * UU - User that will be unsubscribe.
                -Actions
              1.- Vefify user UT is not equal to UU
              2.- Verify if UT is owner of company
              3.- Verify UU is on company user list
              3.- Find UU
              4.- Remove company_id from UU's company array
              5.- Remove UU's id from company's user array
            */
            company = this;
            ut_id = ut._id;
            company_id = ut.selected_company_id;
            user_owner_id = company.user_owner_id;

            if (!ut_id.equals(uu_id)) {
              _context.next = 6;
              break;
            }

            throw {
              message: 'User cannot unsubscribe himself',
              html_code: 400
            };

          case 6:
            if (ut_id.equals(user_owner_id)) {
              _context.next = 8;
              break;
            }

            throw {
              message: 'User cannot unsubscribe other user because is not owner of the company',
              html_code: 401
            };

          case 8:
            result = company.users.filter(function (user) {
              return user.equals(uu_id);
            });

            if (!(result.length == 0)) {
              _context.next = 11;
              break;
            }

            throw {
              message: 'User that will be unsubscribe is not in company user list',
              html_code: 400
            };

          case 11:
            _context.next = 13;
            return _user.User.findById(uu_id);

          case 13:
            uu = _context.sent;

            if (uu) {
              _context.next = 16;
              break;
            }

            throw {
              message: 'User was not found',
              html_code: 404
            };

          case 16:
            _context.next = 18;
            return company.removeUser(uu_id);

          case 18:
            _context.next = 20;
            return uu.removeCompany(company_id);

          case 20:
            return _context.abrupt('return', uu);

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

CompanySchema.methods.unsubscribeUser = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ut) {
    var company, ut_id, company_id, user_owner_id;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            /*
              -Unsubscribe himself from a company
                -Actors
              * UT - User that triggers the action and will be unsubscribe.
                -Action
              1.- Verify if UT is owner of company
              2.- Pull company_id from UT's companies
            */

            company = this;
            ut_id = ut._id;
            company_id = ut.selected_company_id;
            user_owner_id = company.user_owner_id;

            if (!ut_id.equals(user_owner_id)) {
              _context2.next = 6;
              break;
            }

            throw {
              message: 'User cannot be unsubscribed because is the only owner of the company',
              html_code: 401
            };

          case 6:
            _context2.next = 8;
            return company.removeUser(ut_id);

          case 8:
            _context2.next = 10;
            return ut.removeCompany(company_id);

          case 10:
            return _context2.abrupt('return', ut);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}();

CompanySchema.methods.removeUser = function (user_id) {
  var company = this;
  company.users = company.users.filter(function (user) {
    return !user.equals(user_id);
  });
  return company.save();
};

CompanySchema.statics.getAll = function (user_id) {
  return this.find({
    user_owner_id: user_id
  });
};

CompanySchema.pre('save', _pre_trim.pre_save_trim);

CompanySchema.post('save', function (company) {
  //It will update user company
  return _user.User.findOneAndUpdate({
    _id: company.user_owner_id
  }, {
    $set: {
      selected_company_id: company._id
    },
    $push: { companies: company._id }
  }, {
    new: true
  }).then(function (user_doc) {
    return _promise2.default.resolve(company);
  });
});

CompanySchema.post('remove', function (company) {
  //It will delete all clients, suppliers, products and sales.
  //I will not remove the company from users because it will take a while. Instead when user try to use company it will remove it from its document
  return _promise2.default.all([_client.Client.remove({ company_id: company._id }), _supplier.Supplier.remove({ company_id: company._id }), _product.Product.remove({ company_id: company._id }), _sale.Sale.remove({ company_id: company._id })]);
});

var Company = _mongoose2.default.model('Company', CompanySchema);

module.exports = { Company: Company };
//# sourceMappingURL=company.js.map