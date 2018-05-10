const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');
const {pre_save_trim} = require('../helpers');

const ClientSchema = new mongoose.Schema({
  fist_name: {
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

ClientSchema.statics.getAll = function (){
  return this.find({})
};

//All string fields will be trimmed
ClientSchema.pre('save', pre_save_trim);

const Client = mongoose.model('Client', ClientSchema);

module.exports = {Client};
