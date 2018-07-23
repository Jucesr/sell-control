import mongoose from 'mongoose'
import validator from 'validator'
import moment from 'moment'
import pick from 'lodash/pick'
import {pre_save_trim} from '../middleware/pre_trim'

const ClientSchema = new mongoose.Schema({
  company_id:{
    type: mongoose.Schema.Types.ObjectId,
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
      validator: (value) =>{
        return validator.isEmail(value);
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

ClientSchema.index({email: 1, company_id: 1}, {unique: true});

ClientSchema.statics.getAll = function (_id){
  return this.find({
    company_id: _id
  })
};

ClientSchema.methods.toJSON = function () {
  let objDoc = this.toObject();

  return pick(objDoc, [
    '_id',
    'first_name',
    'last_name',
    'address',
    'email',
    'phone',
    'createdAt'
  ]);
};

//All string fields will be trimmed
ClientSchema.pre('save', pre_save_trim);

const Client = mongoose.model('Client', ClientSchema);

module.exports = {Client};
