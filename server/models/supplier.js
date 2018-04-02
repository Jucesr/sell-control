const mongoose = require('mongoose');
const moment = require('moment');

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
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
    minlength: 3
  },
  phone: {
    type: String
  },
  createdAt: {
    type: Number,
    default: moment()
  }
});

SupplierSchema.statics.getAll = function (){

  return this.find({})

};


const Supplier = mongoose.model('Supplier', SupplierSchema);

module.exports = {Supplier};
