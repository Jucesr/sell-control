const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const bcrypt = require('bcryptjs');

const {pre_save_trim} = require('../middleware/pre_trim');

var UserSchema = new mongoose.Schema({
  company_id:{
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

  return pick(userObject, ['_id', 'username','email']);
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

UserSchema.statics.findByCredentials = function (email, password){
  var User = this;
  let error_message = {
    error: 'Email or password are not valid'
  }

  return User.findOne({email}).then( (user) => {
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
