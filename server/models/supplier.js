const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');
const pick = require('lodash/pick');
const {pre_save_trim} = require('../middleware/pre_trim');

const SupplierSchema = new mongoose.Schema({
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
    unique: true,
    validate: {
      validator: (value) =>{
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  phone: {
    type: String
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

SupplierSchema.index({email: 1, company_id: 1}, {unique: true});

SupplierSchema.statics.getAll = function (_id){
  return this.find({
    company_id: _id
  })
};

SupplierSchema.methods.toJSON = function () {
  let objDoc = this.toObject();

  return pick(objDoc, [
    '_id',
    'name',
    'contact_name',
    'address',
    'email',
    'phone',
    'createdAt'
  ]);
};

//All string fields will be trimmed
SupplierSchema.pre('save', pre_save_trim);

const Supplier = mongoose.model('Supplier', SupplierSchema);

module.exports = {Supplier};
