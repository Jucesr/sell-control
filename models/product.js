const addCrudOperations = require('./_crud');
const mongoose = require('mongoose');
const pick = require('lodash/pick');
const pre_save_trim = require('../middleware/pre_trim');
const {ObjectID} = require('mongodb');
const errors = require('../config/errors');
const Supplier = require('./supplier');

const ENTITY_NAME = 'Product';

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
  stock: {
    type: Number,
    default: -1
  }
},{
  name: ENTITY_NAME,
  timestamps: true
})

ProductSchema.index({code: 1, company_id: 1}, {unique: true})

ProductSchema.statics = addCrudOperations(ProductSchema.statics, ENTITY_NAME);

ProductSchema.statics._findAll = function (req){

  return this.find({
    company_id: req.body.company_id
  })
}
ProductSchema.methods.toJSON = function () {
  let objDoc = this.toObject()

  return pick(objDoc, [
    '_id',
    'supplier_id',
    'code',
    'name',
    'description',
    'uom',
    'cost',
    'price',
    'stock',
    'createdAt'
  ])
}

ProductSchema.pre('save', pre_save_trim)

ProductSchema.pre('validate', function(next){
  //Will validate that supplier_id is on the database
  const self = this
  const company_id = self.company_id
  const supplier_id = self.supplier_id
  
  if(!ObjectID.isValid(self.supplier_id)){
    return next({
      isCustomError: true,
      body: errors.ENTITY_NOT_FOUND.replace('@ENTITY_NAME', "Supplier").replace('@ID', supplier_id)
    })
  }

  Supplier.findOne({
    _id: supplier_id,
    company_id
  }).then(
    (doc) => {
      if(!doc)
        return next({
          isCustomError: true,
          body: errors.ENTITY_NOT_FOUND.replace('@ENTITY_NAME', "Supplier").replace('@ID', supplier_id)
        })
        next()
    })
})


module.exports = mongoose.model(ENTITY_NAME, ProductSchema)
