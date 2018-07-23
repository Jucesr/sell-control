'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator2 = require('validator');

var _validator3 = _interopRequireDefault(_validator2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _pre_trim = require('../middleware/pre_trim');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientSchema = new _mongoose2.default.Schema({
  company_id: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  first_name: {
    type: String,
    required: true,
    minlength: 1
  },
  last_name: {
    type: String
  },
  address: {
    type: String
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function validator(value) {
        return _validator3.default.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  phone: {
    type: String
  },
  createdAt: {
    type: Number,
    default: (0, _moment2.default)()
  }
});

ClientSchema.index({ email: 1, company_id: 1 }, { unique: true });

ClientSchema.statics.getAll = function (_id) {
  return this.find({
    company_id: _id
  });
};

ClientSchema.methods.toJSON = function () {
  var objDoc = this.toObject();

  return (0, _pick2.default)(objDoc, ['_id', 'first_name', 'last_name', 'address', 'email', 'phone', 'createdAt']);
};

//All string fields will be trimmed
ClientSchema.pre('save', _pre_trim.pre_save_trim);

var Client = _mongoose2.default.model('Client', ClientSchema);

module.exports = { Client: Client };
//# sourceMappingURL=client.js.map