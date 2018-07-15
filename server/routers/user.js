const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const mongoose = require('mongoose')
const {User} = require('../models/user')
const {Company} = require('../models/company')

const {authenticate} = require('../middleware/authenticate')
const {validate_company} = require('../middleware/validate_company')
const {remove, update, getAll} = require('./_base')
const {log, error_handler} = require('../helpers')

router.use(bodyParser.json())

router.post('/', (req, res) => {
  //Don't ever let user assign _id
  delete req.body._id;
  delete req.body.company_id;
  delete req.body.companies;

  const user = new User({
    ...req.body
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
  }).catch( e => error_handler(e, res, 'User', 'creating'));
});

router.post('/login', (req, res) => {
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
      }).catch( e => error_handler(e, res, 'User', 'logging'));
});

router.post('/login/token', (req, res) => {
  let {token} = req.body
    let user_doc;

    User.findByToken(token).then(
      doc => {
        log('An user logged in by token');
        res.send({
          ...doc.toJSON(),
          token
        })
      }).catch( e => error_handler(e, res, 'User', 'logging'));
});

router.delete('/login/token', authenticate,  (req, res) => {
  req.user.removeToken(req.token).then( () => {
    log('An user logged off');
    res.status(200).send();
  }).catch( e => error_handler(e, res, 'User', 'logging off'));
});

router.delete('/', authenticate,  (req, res) => {
  User.findByIdAndRemove(req.user._id).then(
    doc => {
      if(!doc){
        return error_handler({
          message: `User was not found`,
          errcode: 404
        }, res, 'User', 'removing')
      }
      res.status(200).send(doc);
      log(`User was removed`);
  }).catch( e => error_handler(e, res, 'User', 'removing') );
});

router.patch('/me', authenticate, (req, res) => {
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
    ).catch( e => error_handler(e, res, 'User', 'updating'));
  }else{
    error_handler({
      message: 'Company id is not part of available companies',
      errcode: 404
    }, res, 'User', 'updating')
  }
});

router.patch('/unsubscribe/:id', authenticate, validate_company, (req, res) => {
  /*
    -Unsubscribe an user from a company

    -Actors
    * UT - User that triggers the action.
    * UU - User that will be unsubscribe.

    -Action
    1.- Verify if UT is owner of company
    2.- Find UU
    3.- Pull company_id from UU's companies
  */
  let uu_id = req.params.id;
  let ut_id = req.user._id;
  let company_id = req.user.selected_company_id;
  let user_owner_id = req.company.user_owner_id;

  if(!ut_id.equals(user_owner_id)){
    return error_handler({
      message: 'User cannot unsubscribe other user because is not owner of the company',
      errcode: 401
    }, res, 'User', 'unsubscribing')
  }
  User.findById(uu_id).then(
    uu => {
      if(!uu || !uu.selected_company_id){
        return Promise.reject({
          message: 'User was not found',
          errcode: 404
        })
      }
      return uu.removeCompany(company_id)
  }).then(
    user => {
      log(`${req.user.username} has unsubscribed ${user.username} from ${req.company.name}`);
      res.status(200).send(user);
  }).catch( e => error_handler(e, res, 'User', 'unsubscribing'));
});

router.patch('/me/unsubscribe/', authenticate, validate_company, (req, res) => {
  /*
    -Unsubscribe himself from a company

    -Actors
    * UT - User that triggers the action and will be unsubscribe.

    -Action
    1.- Verify if UT is owner of company
    2.- Pull company_id from UT's companies
  */

  let ut_id = req.user._id;
  let company_id = req.user.selected_company_id;
  let user_owner_id = req.company.user_owner_id;

  if(ut_id.equals(user_owner_id)){
    return error_handler({
      message: 'User cannot be unsubscribed because is the only owner of the company',
      errcode: 401
    }, res, 'User', 'unsubscribing')
  }
  req.user.removeCompany(company_id).then(
    user => {
      log(`${req.user.username} has been unsubscribed from ${req.company.name}`);
      res.status(200).send(user);
  }).catch( e => error_handler(e, res, 'User', 'unsubscribing'));
});


module.exports = router
