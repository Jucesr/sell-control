const validator = require('validator');
const addCrudOperations = require('./_crud');
const auth = require('../services/auth.service')
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const errors = require('../config/errors')
const mongoose = require('mongoose');
const pick = require('lodash/pick');
const pre_save_trim = require('../middleware/pre_trim');

const ENTITY_NAME = 'User';

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

},{
  name: ENTITY_NAME,
  timestamps : true
});

UserSchema.statics = addCrudOperations(UserSchema.statics, ENTITY_NAME);
  
  UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
  
    return pick(userObject, ['_id', 'username','email', 'selected_company_id','companies']);
  };
  
  UserSchema.methods.generateAuthToken = function (){
    let user = this;
    let access = 'auth';
    let token = auth.issue({_id: user._id.toHexString(), access}).toString();
  
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
        http_code: 404
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
    user.companies = await Promise.all(user.companies.map(async company => {
      //If user is not the owner return just return name and id of the company
      if(!company.user_owner_id.equals(user._id)){
        return {
          name: company.name,
          _id: company._id
        }
      }
      //User is owner bring all users from each company. 
      let proms = company.users.map(user_id => User.findById(user_id))
      
      let users = await Promise.all(proms)
  
      //Just pick some fields of each user.
      company.users = users.map(user => pick(user, ['_id', 'username','email']))
  
      return company
    }))
  
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
          http_code: 400
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
    try{
      decoded = auth.verify(token);
    } catch(e) {
      throw {
        isCustomError: true,
        html_code: 401,
        body: errors.INVALID_TOKEN
      } 
    }
  
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  
  };

  UserSchema.statics.findByCredentials = async function ({username, email, password}){
    var User = this;
    
    const user = await User.findOne({
      $or:[
        {email},
        {username}
      ]
    })

    if(!user){
      throw errors.INCORRECT_PASSWORD
    }

    return new Promise( (resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        }else{
          reject(errors.INCORRECT_PASSWORD);
        }
      });
    } )
  
  
  };
  
  //UserSchema.pre('save', pre_save_trim);
  
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

const User = mongoose.model(ENTITY_NAME, UserSchema);

module.exports = User;
