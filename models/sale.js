
const Product = require('./product');
const addCrudOperations = require('./_crud');
const mongoose = require('mongoose');
const pre_save_trim = require('../middleware/pre_trim');

const ENTITY_NAME = 'Sale';

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
    type: Number
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
    name: String,
    uom: String,
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
},{
  name: ENTITY_NAME,
  timestamps: true
})

SaleSchema.statics = addCrudOperations(SaleSchema.statics, ENTITY_NAME);

//  All string fields will be trimmed
SaleSchema.pre('save', pre_save_trim)


SaleSchema.post('save', function(){
  //  Updates all product stock after the sell
  this.sale_details.forEach(sale_detail => {
    Product.findOne({
      _id: sale_detail.product_id,
      company_id: this.company_id
    }).then(
      product => {
        //  Just update products that are being track
        if(product.stock != -1){
          product.set({
            stock: product.stock - sale_detail.quantity
          })
          product.save()
        }
        
      }
    )
  })
})



module.exports = mongoose.model(ENTITY_NAME, SaleSchema)
