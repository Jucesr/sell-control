const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');
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

SupplierSchema.statics.getAll = function (){
  return this.find({})
};

//All string fields will be trimmed
SupplierSchema.pre('save', pre_save_trim);

const Supplier = mongoose.model('Supplier', SupplierSchema);

module.exports = {Supplier};
