const mongoose = require('mongoose');
const {pre_save_trim} = require('../middleware/pre_trim');

var CompanySchema = new mongoose.Schema({
  user_owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  max_users: {
    type: Number,
    default: 2
  },
  name: {
    type: String,
    required: true
  },
});

CompanySchema.statics.getAll = function (user_id){
  return this.find({
    user_owner_id: user_id
  })
};

//All string fields will be trimmed
CompanySchema.pre('save', pre_save_trim);

var Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
