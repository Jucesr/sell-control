const mongoose = require('mongoose')
const {pre_save_trim} = require('../middleware/pre_trim')

const {User} = require('./user')
const {Client} = require('./client')
const {Product} = require('./product')
const {Supplier} = require('./supplier')
const {Sale} = require('./sale')

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

CompanySchema.post('save', function(company) {
  //It will update user company
  return User.findOneAndUpdate({
    _id: company.user_owner_id
  }, {
    $set: {
      selected_company_id: company._id
    },
    $push: { companies: company._id }
  }, {
    new: true
  }).then(
    user_doc => Promise.resolve(company)
  ).catch(
    e => Promise.reject(null)
  )
});

CompanySchema.post('remove', function(company) {
  //It will delete all clients, suppliers, products and sales.
  //I will not remove the company from users because it will take a while. Instead when user try to use company it will remove it from its document
  return Promise.all([
    Client.remove({company_id: company._id}),
    Supplier.remove({company_id: company._id}),
    Product.remove({company_id: company._id}),
    Sale.remove({company_id: company._id})
  ]);

});

var Company = mongoose.model('Company', CompanySchema);

module.exports = {Company};
