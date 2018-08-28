import mongoose from 'mongoose'
import moment from 'moment'
import {pre_save_trim} from '../middleware/pre_trim'

const SaleSchema = new mongoose.Schema({
  company_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  date: {
    type: Number,
    default: moment()
  },
  total: {
    type: Number,
    required: true
  },
  sale_details: [{
    _id:false,
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    code: String,
    quantity: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
    },
    unit_rate: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }]
})

//All string fields will be trimmed
SaleSchema.pre('save', pre_save_trim)



export const Sale = mongoose.model('Sale', SaleSchema)
