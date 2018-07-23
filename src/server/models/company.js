import mongoose from 'mongoose'
import {pre_save_trim} from '../middleware/pre_trim'

import {User} from './user'
import {Client} from './client'
import {Product} from './product'
import {Supplier} from './supplier'
import {Sale} from './sale'

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
      html_code: 400
    }
  }

  if(!ut_id.equals(user_owner_id)){
    throw {
      message: 'User cannot unsubscribe other user because is not owner of the company',
      html_code: 401
    }
  }

  let result = company.users.filter(user => user.equals(uu_id))

  if(result.length == 0){

    throw {
      message: 'User that will be unsubscribe is not in company user list',
      html_code: 400
    }
  }

  let uu = await User.findById(uu_id)

  if(!uu){
    throw {
      message: 'User was not found',
      html_code: 404
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
    * UT - User that triggers the action and will be unsubscribe.

    -Action
    1.- Verify if UT is owner of company
    2.- Pull company_id from UT's companies
  */

  let company = this;
  let ut_id = ut._id;
  let company_id = ut.selected_company_id;
  let user_owner_id = company.user_owner_id;

  if(ut_id.equals(user_owner_id)){
    throw {
      message: 'User cannot be unsubscribed because is the only owner of the company',
      html_code: 401
    }
  }

  await company.removeUser(ut_id)

  await ut.removeCompany(company_id)

  return ut;


}

CompanySchema.methods.removeUser = function(user_id) {
  let company = this
  company.users = company.users.filter(user => !user.equals(user_id))
  return company.save()
}

CompanySchema.statics.getAll = function (user_id){
  return this.find({
    user_owner_id: user_id
  })
};

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
