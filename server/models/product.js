const mongoose = require('mongoose');
const moment = require('moment');
const {pre_save_trim} = require('../helpers');

const ProductSchema = new mongoose.Schema({
  supplier_id: {
    type: String,
    required: true,
    default: '-1'
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
  company_id:{
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    default: moment()
  }
});

ProductSchema.statics.getAll = function (){
  return this.find({})
};

//All string fields will be trimmed
ProductSchema.pre('save', pre_save_trim);

const Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
