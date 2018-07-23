import mongoose from 'mongoose'
import validator from 'validator'
import moment from 'moment'
import pick from 'lodash/pick'
import {pre_save_trim} from '../middleware/pre_trim'

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
  },
  createdAt: {
    type: Number,
    default: moment()
  }
})

SupplierSchema.index({email: 1, company_id: 1}, {unique: true})

SupplierSchema.statics.getAll = function (_id){
  return this.find({
    company_id: _id
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

export const Supplier = mongoose.model('Supplier', SupplierSchema)
