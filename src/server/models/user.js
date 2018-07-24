import mongoose from 'mongoose'
import {ObjectID} from 'mongodb'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import pick from 'lodash/pick'
import bcrypt from 'bcryptjs'

import {Company} from './company'
import {pre_save_trim} from '../middleware/pre_trim'

const UserSchema = new mongoose.Schema({
  selected_company_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  companies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }],
  max_companies: {
    type: Number,
    default: 1
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) =>{
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLengh: 6
  },
  tokens: [{
    _id:false,
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return pick(userObject, ['_id', 'username','email', 'selected_company_id','companies']);
};

UserSchema.methods.generateAuthToken = function (){
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then( () => {
    return token;
  } );
};

UserSchema.methods.removeToken = function (token){
  let user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });


};

UserSchema.methods.removeCompany = function (company_id){
  let user = this;
  //Had to do this because $pull was not working with objectID
  user.companies = user.companies.filter(company => !company.equals(company_id))

  if(user.selected_company_id && user.selected_company_id.equals(company_id)){
    user.set({ selected_company_id: null });

    //In case we'd like to select a ramdom company
    //
    // if(user.companies.length > 0){
    //   user.selected_company_id = user.companies[Math.floor(Math.random() * user.companies.length)]
    // }else{
    //   user.set({ selected_company_id: null });
    // }
  }
  return user.save();
};

UserSchema.methods.addCompany = function (company_id){
  let user = this
  user.companies.push(company_id)
  return user.save()
};

UserSchema.methods.selectCompany = function (company_id){
  let user = this

  let result = user.companies.find(company => company.equals(company_id))

  if(!result){
    return Promise.reject ({
      message: 'Company is not part of available companies',
      html_code: 404
    })
  }

  user.selected_company_id = company_id

  return user.save()

};

UserSchema.methods.populateCompanies = async function (){
  //Get all companies from a user. If user is owner of the company it will bring everything
  //if user is just a member it will bring the name and id

  let user = this
  user = await user.populate('companies').execPopulate()

  user = user.toObject()
  user.companies = user.companies.map(company => {
    if(!company.user_owner_id.equals(user._id)){
      return {
        name: company.name,
        _id: company._id
      }
    }
    return company
  })

  user = pick(user, ['_id', 'username','email', 'selected_company_id','companies'])

  return user

};

UserSchema.methods.customRemove = async function(){
  let user = this

  let userObject = await user.populateCompanies()

  userObject.companies.forEach(company => {
    if(company.hasOwnProperty('max_users')){
      throw {
        message: 'User cannot be deleted because it owns 1 or more companies',
        html_code: 400
      }
    }
  })

  userObject.companies.forEach(async company => {
    let company_doc = await Company.findById(company._id)
    company_doc = await company_doc.removeUser(user._id)
  })

  return user.remove()

}

UserSchema.statics.findByToken = function (token){
  var User = this;
  var decoded;
  let error_message = {
    message: 'Token has expired',
    html_code: 401
  }

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e) {
    return Promise.reject({
      message: 'Invalid token',
      html_code: 400
    });
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  }).then( user => {
    if(!user)
      return Promise.reject(error_message)

    return Promise.resolve(user)
  });
};

UserSchema.statics.findByCredentials = function (username, email, password){
  //It can search user by email or by username
  let User = this;
  //let finder = email || username;
  let error_message = {
    message: 'Email or password are not valid',
    html_code: 400
  }

  return User.findOne({
    $or:[
      {email},
      {username}
    ]
  }).then( (user) => {
    if(!user)
      return Promise.reject(error_message);

    return new Promise( (resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        }else{
          reject(error_message);
        }
      });
    } )
  });


};

UserSchema.pre('save', pre_save_trim);

UserSchema.pre('save', function (next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });

  }else{
    next();
  }
});

export const User = mongoose.model('User', UserSchema);
