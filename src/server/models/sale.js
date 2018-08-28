import mongoose from 'mongoose'
import moment from 'moment'
import {Client} from './client'
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
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
    },
    total: {
      type: Number,
      required: true
    }
  }]
})

SaleSchema.pre('validate', function(next){
  //If client_id is provided it will validate that is on the database
  const self = this
  const company_id = self.company_id
  const client_id = self.client_id

  if(!!client_id){
    if(!ObjectID.isValid(client_id)){
      return next({
        message: 'Client ID has invalid format',
        http_code: '400'
      })
    }
  
    Client.findOne({
      _id: client_id,
      company_id
    }).then(
      (doc) => {
        if(!doc)
          return next({
            message: `Client was not found`,
            http_code: '404'
          })
          next()
      })
  }
  next()
  })

  

// SaleSchema.statics.getAll = function (user_id){
//   return this.find({
//     user_owner_id: user_id
//   })
// }

//All string fields will be trimmed
SaleSchema.pre('save', pre_save_trim)



export const Sale = mongoose.model('Sale', SaleSchema)
