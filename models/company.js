const addCrudOperations = require('./_crud');
const mongoose = require('mongoose');
const pre_save_trim = require('../middleware/pre_trim');

const User = require('./user');
const Client = require('./client');
const Product = require('./product');
const Supplier = require('./supplier');
const Sale = require('./sale');

const ENTITY_NAME = 'Company';
const CompanySchema = new mongoose.Schema({
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

CompanySchema.statics = addCrudOperations(CompanySchema.statics, ENTITY_NAME);

CompanySchema.methods.unsubscribeOtherUser = async function (ut, uu_id){
  /*
    -Unsubscribe an user from a company

    -Actors
    * UT - User that triggers the action.
    * UU - User that will be unsubscribe.

    -Actions
    1.- Vefify user UT is not equal to UU
    2.- Verify if UT is owner of company
    3.- Verify UU is on company user list
    3.- Find UU
    4.- Remove company_id from UU's company array
    5.- Remove UU's id from company's user array
  */

  let company = this;
  let ut_id = ut._id;
  let company_id = ut.selected_company_id;
  let user_owner_id = company.user_owner_id;

  if(ut_id.equals(uu_id)){
    throw {
      message: 'User cannot unsubscribe himself',
      http_code: 400
    }
  }

  if(!ut_id.equals(user_owner_id)){
    throw {
      message: 'User cannot unsubscribe other user because is not owner of the company',
      http_code: 401
    }
  }

  let result = company.users.filter(user => user.equals(uu_id))

  if(result.length == 0){

    throw {
      message: 'User that will be unsubscribe is not in company user list',
      http_code: 400
    }
  }

  let uu = await User.findById(uu_id)

  if(!uu){
    throw {
      message: 'User was not found',
      http_code: 404
    }
  }

  await company.removeUser(uu_id)

  await uu.removeCompany(company_id)

  return uu;

}

CompanySchema.methods.unsubscribeUser = async function (ut){
  /*
    -Unsubscribe himself from a company

    -Actors
    * UT - User that triggers the action and will be unsubscribed.

    -Actions
    1.- Verify if UT is owner of company
    2.- Pull company_id from UT's companies
  */

  let company = this;
  let ut_id = ut._id;
  let company_id = ut.selected_company_id;
  let user_owner_id = company.user_owner_id;

  if(ut_id.equals(user_owner_id)){
    throw {
      message: 'User cannot unsubscribe himself because is the owner of the company',
      http_code: 401
    }
  }

  await company.removeUser(ut_id)

  await ut.removeCompany(company_id)

  return ut;


}

CompanySchema.methods.subscribeUser = async function (ut, uu_id){
  /*
    -Subscribe another company

    -Actors
    * UT - User that triggers the action.
    * UU - User that will be subscribed.

    -Actions
    1.- Vefify max_users
    2.- Vefify user UT is not equal to UU
    3.- Verify if UT is owner of company
    4.- Verify UU is on company user list
    5.- Find UU
    6.- Add company_id to UU's company array
    7.- Add UU's id to company's user array
  */

  let company = this;
  let ut_id = ut._id;
  let company_id = ut.selected_company_id;
  let user_owner_id = company.user_owner_id;

  if(company.max_users == company.users.length){
    throw {
      message: 'Company cannot have more users.',
      http_code: 400
    }
  }

  if(ut_id.equals(uu_id)){
    throw {
      message: 'User cannot subscribe himself to a company',
      http_code: 400
    }
  }

  if(!ut_id.equals(user_owner_id)){
    throw {
      message: 'User cannot subscribe other user because is not owner of the company',
      http_code: 401
    }
  }

  let result = company.users.filter(user => user.equals(uu_id))

  if(result.length > 0){

    throw {
      message: 'User is subscribed already',
      http_code: 400
    }
  }

  let uu = await User.findById(uu_id)

  if(!uu){
    throw {
      message: 'User was not found',
      http_code: 404
    }
  }

  await company.addUser(uu_id)

  await uu.addCompany(company_id)

  return uu;


}

CompanySchema.methods.removeUser = function(user_id) {
  let company = this
  company.users = company.users.filter(user => !user.equals(user_id))
  return company.save()
}

CompanySchema.methods.addUser = function(user_id) {
  let company = this
  company.users.push(user_id)
  return company.save()
}

CompanySchema.methods.updateMaxUsers = function(action) {
  let company = this

  switch (action) {
    case 'increase':
      company.max_users = company.max_users + 1;
    break;
    case 'decrease':
      if(company.users.length == company.max_users){
        return Promise.reject({
          message: 'Cannot decrase max user number because it has users subscribed',
          http_code: 400
        })
      }

      company.max_users = company.max_users - 1;
    break;

    default:

    return Promise.reject({
      message: 'Invalid action',
      http_code: 400
    })
  }

  return company.save()
}

CompanySchema.methods.create = async function() {
  let company = this
  //It will update user company

  await User.findOneAndUpdate({
    _id: company.user_owner_id
  }, {
    $set: {
      selected_company_id: company._id
    },
    $push: { companies: company._id }
  }, {
    new: true
  })

  let company_doc = await company.save()

  return company_doc

}

CompanySchema.methods.changeOwner = async function(user_id) {
  let company = this

  let user = await User.findById(user_id)

  if(!user){
    throw {
      message: 'User was not found',
      http_code: 404
    }
  }

  company.user_owner_id = user_id
  await company.save()

  return user
}

CompanySchema.methods.populateUsers = async function (){
  //Get all companies from a user. If user is owner of the company it will bring everything
  //if user is just a member it will bring the name and id

  let company = this
  company = await company.populate('users').execPopulate()
  return company

};

CompanySchema.statics.getAll = function (user_id){
  return this.find({
    user_owner_id: user_id
  })
};

CompanySchema.pre('save', pre_save_trim);

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

module.exports = mongoose.model(ENTITY_NAME, CompanySchema);
