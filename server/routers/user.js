const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const mongoose = require('mongoose')
const {User} = require('../models/user')
const {Company} = require('../models/company')

const {authenticate} = require('../middleware/authenticate')
const {validate_company} = require('../middleware/validate_company')
const {error_handler} = require('../middleware/error_handler')
const {remove, update, getAll} = require('./_base')
const {log} = require('../helpers')

router.use(bodyParser.json())

router.post('/', (req, res, next) => {

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  let user_doc;
  user.save().then(
    doc => {
      user_doc = doc.toJSON();
      log('An user was created');
      return user.generateAuthToken();
    }
  ).then(
    token => {
      res.header('x-auth', token).send({
        ...user_doc,
        token
      })
  }).catch( e => next(e));
});

router.post('/login', (req, res, next) => {
    let {email, password, username} = req.body

    let user_doc;

    User.findByCredentials(username, email, password).then(
      doc => {
        user_doc = doc.toJSON();
        return doc.generateAuthToken()
      }).then( (token) =>{
        log('An user logged in by credentials');
        res.header('x-auth',token).send({
          ...user_doc,
          token
        });
      }).catch( e => next(e));
});

router.post('/login/token', (req, res, next) => {
  let {token} = req.body
  let user_doc;

  User.findByToken(token).then(
    doc => {
      log('An user logged in by token');
      res.send({
        ...doc.toJSON(),
        token
      })
    }).catch( e => next(e));
});

router.delete('/login/token', authenticate,  (req, res, next) => {
  req.user.removeToken(req.token).then( () => {
    log('An user logged off');
    res.status(200).send({
      message:'An user logged off'
    });
  }).catch( e => next(e));
});

// router.delete('/me', authenticate, remove(User));

router.patch('/me', authenticate, (req, res, next) => {
  //Only selected_company_id can be updated.
  let company_id = req.body.selected_company_id;
  let user = req.user;
  let result = user.companies.find(company => company.equals(company_id))
  if(result){
    user.update(
      { $set: {selected_company_id: company_id}},
      { new: true }
    ).then(
      doc => {
        res.status(200).send(doc);
        log(`User was updated`);
      }
    ).catch( e => next(e));
  }else{
    next({
      message: 'Company id is not part of available companies',
      html_code: 404
    })
  }
});

router.get('/me', authenticate, (req, res, next) =>{
  log('An user was sent');
  res.send({
    ...req.user.toJSON()
  });
});

router.use(error_handler('User'))


module.exports = router
