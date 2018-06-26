const mongoose = require('mongoose');
const moment = require('moment');
const pick = require('lodash/pick');
const {pre_save_trim} = require('../middleware/pre_trim');

const ProductSchema = new mongoose.Schema({
  company_id:{
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
  inventory: {
    type: Boolean
  },
  how_many: {
    type: Number
  },
  createdAt: {
    type: Number,
    default: moment()
  }
});

ProductSchema.index({code: 1, company_id: 1}, {unique: true});

ProductSchema.statics.getAll = function (_id){
  return this.find({
    company_id: _id
  })
};

ProductSchema.methods.toJSON = function () {
  let objDoc = this.toObject();

  return pick(objDoc, [
    '_id',
    'code',
    'name',
    'description',
    'uom',
    'cost',
    'price',
    'inventory',
    'how_many',
    'createdAt'
  ]);
};

//All string fields will be trimmed
ProductSchema.pre('save', pre_save_trim);

const Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
