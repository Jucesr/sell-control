'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongodb = require('mongodb');

var _validator2 = require('validator');

var _validator3 = _interopRequireDefault(_validator2);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _pre_trim = require('../middleware/pre_trim');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose2.default.Schema({
  selected_company_id: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  companies: [{
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Company'
  }],
  max_companies: {
    type: Number,
    default: 1
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function validator(value) {
        return _validator3.default.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLengh: 6
  },
  tokens: [{
    _id: false,
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return (0, _pick2.default)(userObject, ['_id', 'username', 'email', 'selected_company_id', 'companies']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = _jsonwebtoken2.default.sign({ _id: user._id.toHexString(), access: access }, process.env.JWT_SECRET).toString();

  user.tokens.push({ access: access, token: token });

  return user.save().then(function () {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: { token: token }
    }
  });
};

UserSchema.methods.removeCompany = function (company_id) {
  var user = this;
  //Had to do this because $pull was not working with objectID
  user.companies = user.companies.filter(function (company) {
    return !company.equals(company_id);
  });

  if (user.selected_company_id && user.selected_company_id.equals(company_id)) {
    user.set({ selected_company_id: null });

    //In case we'd like to select a ramdom company
    //
    // if(user.companies.length > 0){
    //   user.selected_company_id = user.companies[Math.floor(Math.random() * user.companies.length)]
    // }else{
    //   user.set({ selected_company_id: null });
    // }
  }
  return user.save();
};

UserSchema.statics.getAll = function (_id) {
  if (_id) {
    return this.find({
      company_id: _id
    });
  }

  return _promise2.default.resolve([]);
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  var error_message = {
    message: 'Token has expired',
    html_code: 401
  };

  try {
    decoded = _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return _promise2.default.reject({
      message: 'Invalid token',
      html_code: 400
    });
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  }).then(function (user) {
    if (!user) return _promise2.default.reject(error_message);

    return _promise2.default.resolve(user);
  });
};

UserSchema.statics.findByCredentials = function (username, email, password) {
  //It can search user by email or by username
  var User = this;
  //let finder = email || username;
  var error_message = {
    message: 'Email or password are not valid',
    html_code: 400
  };

  return User.findOne({
    $or: [{ email: email }, { username: username }]
  }).then(function (user) {
    if (!user) return _promise2.default.reject(error_message);

    return new _promise2.default(function (resolve, reject) {
      _bcryptjs2.default.compare(password, user.password, function (err, res) {
        if (res) {
          resolve(user);
        } else {
          reject(error_message);
        }
      });
    });
  });
};

UserSchema.pre('save', _pre_trim.pre_save_trim);

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    _bcryptjs2.default.genSalt(10, function (err, salt) {
      _bcryptjs2.default.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = _mongoose2.default.model('User', UserSchema);

module.exports = { User: User };
//# sourceMappingURL=user.js.map