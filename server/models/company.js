const mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user_owner_id: {
    type: String,
    required: true
  },
  max_users: {
    type: Number,
    default: 2
  },
  no_users: {
    type: Number,
    default: 1
  }
});

CompanySchema.statics.getAll = function (){
  return this.find({})
};

//All string fields will be trimmed
CompanySchema.pre('save', pre_save_trim);

var Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
