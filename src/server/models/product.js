import mongoose from 'mongoose'
import {ObjectID} from 'mongodb'
import moment from 'moment'
import pick from 'lodash/pick'
import {pre_save_trim} from '../middleware/pre_trim'
import {Supplier} from './supplier'

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
  },
  createdAt: {
    type: Number,
    default: moment()
  }
})

ProductSchema.index({code: 1, company_id: 1}, {unique: true})

ProductSchema.statics.getAll = function (_id){
  return this.find({
    company_id: _id
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
      message: 'Supplier ID has invalid format',
      http_code: '400'
    })
  }

  Supplier.findOne({
    _id: supplier_id,
    company_id
  }).then(
    (doc) => {
      if(!doc)
        return next({
          message: `Supplier was not found`,
          http_code: '404'
        })
        next()
    })
})


export const Product = mongoose.model('Product', ProductSchema)
