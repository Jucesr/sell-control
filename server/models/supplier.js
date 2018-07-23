'use strict';

var mongoose = require('mongoose');
var _validator = require('validator');
var moment = require('moment');
var pick = require('lodash/pick');

var _require = require('../middleware/pre_trim'),
    pre_save_trim = _require.pre_save_trim;

var SupplierSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contact_name: {
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
        return _validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  phone: {
    type: String
  },
  createdAt: {
    type: Number,
    default: moment()
  }
});

SupplierSchema.index({ email: 1, company_id: 1 }, { unique: true });

SupplierSchema.statics.getAll = function (_id) {
  return this.find({
    company_id: _id
  });
};

SupplierSchema.methods.toJSON = function () {
  var objDoc = this.toObject();

  return pick(objDoc, ['_id', 'name', 'contact_name', 'address', 'email', 'phone', 'createdAt']);
};

//All string fields will be trimmed
SupplierSchema.pre('save', pre_save_trim);

var Supplier = mongoose.model('Supplier', SupplierSchema);

module.exports = { Supplier: Supplier };
//# sourceMappingURL=supplier.js.map