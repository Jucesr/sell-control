const addCrudOperations = require('./_crud');
const mongoose = require('mongoose');
const validator = require('validator');
const pick = require('lodash/pick');
const pre_save_trim = require('../middleware/pre_trim');

const ENTITY_NAME = 'Client';
let ClientSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  first_name: {
    type: String,
    required: true
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
});

ClientSchema.statics = addCrudOperations(ClientSchema.statics, ENTITY_NAME);

ClientSchema.index({email: 1, company_id: 1}, {unique: true})

ClientSchema.statics._findAll = function (req){

  return this.find({
    company_id: req.body.company_id
  })
}

ClientSchema.methods.toJSON = function () {
  let objDoc = this.toObject()

  return pick(objDoc, [
    '_id',
    'first_name',
    'last_name',
    'address',
    'email',
    'phone',
    'createdAt'
  ])
}

//All string fields will be trimmed
ClientSchema.pre('save', pre_save_trim)

module.exports = mongoose.model(ENTITY_NAME, ClientSchema)
