const mongoose = require('mongoose');
const moment = require('moment');

const ClientSchema = new mongoose.Schema({
  fist_name: {
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

ClientSchema.statics.getAll = function (){

  return this.find({})

};


const Client = mongoose.model('Client', ClientSchema);

module.exports = {Client};
