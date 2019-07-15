const addCrudOperations = require('./_crud');
const mongoose = require('mongoose');
const validator = require('validator');
const pick = require('lodash/pick');
const pre_save_trim = require('../middleware/pre_trim');
const {ObjectID} = require('mongodb');

const ENTITY_NAME = 'Supplier';

const SupplierSchema = new mongoose.Schema({
  company_id:{
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
      validator: (value) =>{
        return validator.isEmail(value)
      },
      message: '{VALUE} is not a valid email'
    }
  },
  phone: {
    type: String
  }
},{
  name: ENTITY_NAME,
  timestamps: true
})

SupplierSchema.statics = addCrudOperations(SupplierSchema.statics, ENTITY_NAME);

SupplierSchema.index({email: 1, company_id: 1}, {unique: true})

SupplierSchema.statics._findAll = function (req){

  return this.find({
    company_id: req.body.company_id
  })
}

SupplierSchema.methods.toJSON = function () {
  let objDoc = this.toObject()

  return pick(objDoc, [
    '_id',
    'name',
    'contact_name',
    'address',
    'email',
    'phone',
    'createdAt'
  ])
}

//All string fields will be trimmed
SupplierSchema.pre('save', pre_save_trim)

module.exports = mongoose.model(ENTITY_NAME, SupplierSchema)
  
