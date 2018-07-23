'use strict';

var mongoose = require('mongoose');

var _require = require('mongodb'),
    ObjectID = _require.ObjectID;

var moment = require('moment');
var pick = require('lodash/pick');

var _require2 = require('../middleware/pre_trim'),
    pre_save_trim = _require2.pre_save_trim;

var _require3 = require('./supplier'),
    Supplier = _require3.Supplier;

var ProductSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  uom: {
    type: String
  },
  cost: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: -1
  },
  createdAt: {
    type: Number,
    default: moment()
  }
});

ProductSchema.index({ code: 1, company_id: 1 }, { unique: true });

ProductSchema.statics.getAll = function (_id) {
  return this.find({
    company_id: _id
  });
};

ProductSchema.methods.toJSON = function () {
  var objDoc = this.toObject();

  return pick(objDoc, ['_id', 'supplier_id', 'code', 'name', 'description', 'uom', 'cost', 'price', 'stock', 'createdAt']);
};

ProductSchema.pre('save', pre_save_trim);

ProductSchema.pre('validate', function (next) {
  //Will validate that supplier_id is on the database
  var self = this;
  var company_id = self.company_id;
  var supplier_id = self.supplier_id;

  if (!ObjectID.isValid(self.supplier_id)) {
    return next({
      message: 'Supplier ID has invalid format',
      html_code: '400'
    });
  }

  Supplier.findOne({
    _id: supplier_id,
    company_id: company_id
  }).then(function (doc) {
    if (!doc) return next({
      message: 'Supplier was not found',
      html_code: '404'
    });
    next();
  });
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = { Product: Product };
//# sourceMappingURL=product.js.map