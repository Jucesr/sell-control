const mongoose = require('mongoose');
const moment = require('moment');

const ProductSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    minlength: 1
  },
  name: {
    type: String,
    required: true,
    minlength: 1
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

ProductSchema.statics.getAll = function (){

  return this.find({})

};


const Product = mongoose.model('Product', ProductSchema);

module.exports = {Product};
