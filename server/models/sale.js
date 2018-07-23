'use strict';

var mongoose = require('mongoose');
var moment = require('moment');

var _require = require('../middleware/pre_trim'),
    pre_save_trim = _require.pre_save_trim;

var SaleSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  date: {
    type: Number,
    default: moment()
  },
  total: {
    type: Number,
    required: true
  },
  sale_details: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    discount: {
      type: Number
    },
    total: {
      type: Number,
      required: true
    }
  }]
});

// SaleSchema.statics.getAll = function (user_id){
//   return this.find({
//     user_owner_id: user_id
//   })
// };

//All string fields will be trimmed
SaleSchema.pre('save', pre_save_trim);

SaleSchema.pre('save', function (next) {
  var user = this;
});

var Sale = mongoose.model('Sale', SaleSchema);

module.exports = { Sale: Sale };
//# sourceMappingURL=sale.js.map