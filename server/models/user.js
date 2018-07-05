const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const bcrypt = require('bcryptjs');

const {pre_save_trim} = require('../middleware/pre_trim');

var UserSchema = new mongoose.Schema({
  selected_company_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
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
  let selected_company_id = user.selected_company_id
  // console.log(typeof selected_company_id);
  // console.log(typeof company_id);
  // console.log(`selected_company_id: ${selected_company_id} == company_id: ${company_id}`);
  // console.log(user.selected_company_id.equals(company_id));
  if(user.selected_company_id.equals(company_id)){
    if(user.companies.length > 0){
      user.selected_company_id = user.companies[Math.floor(Math.random() * user.companies.length)]
    }else{
      user.selected_company_id = ''
    }
  }
  return user.save();

  //Remove from company too.
};

UserSchema.statics.getAll = function (_id){
  if(_id){
    return this.find({
      company_id: _id
    })
  }

  return Promise.resolve([])

};

UserSchema.statics.findByToken = function (token){
  var User = this;
  var decoded;
  let error_message = {
    error: 'Token has expired'
  }

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch(e) {
    return Promise.reject({
      error: 'Invalid token'
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
    error: 'Email or password are not valid'
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

var User = mongoose.model('User', UserSchema);

module.exports = {User};
