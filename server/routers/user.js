'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var _require = require('mongodb'),
    ObjectID = _require.ObjectID;

var mongoose = require('mongoose');

var _require2 = require('../models/user'),
    User = _require2.User;

var _require3 = require('../models/company'),
    Company = _require3.Company;

var _require4 = require('../middleware/authenticate'),
    authenticate = _require4.authenticate;

var _require5 = require('../middleware/validate_company'),
    validate_company = _require5.validate_company;

var _require6 = require('../middleware/error_handler'),
    error_handler = _require6.error_handler;

var _require7 = require('./_base'),
    remove = _require7.remove,
    update = _require7.update,
    getAll = _require7.getAll;

var _require8 = require('../helpers'),
    log = _require8.log;

router.use(bodyParser.json());

router.post('/', function (req, res, next) {

  var user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  var user_doc = void 0;
  user.save().then(function (doc) {
    user_doc = doc.toJSON();
    log('An user was created');
    return user.generateAuthToken();
  }).then(function (token) {
    res.header('x-auth', token).send((0, _extends3.default)({}, user_doc, {
      token: token
    }));
  }).catch(function (e) {
    return next(e);
  });
});

router.post('/login', function (req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password,
      username = _req$body.username;


  var user_doc = void 0;

  User.findByCredentials(username, email, password).then(function (doc) {
    user_doc = doc.toJSON();
    return doc.generateAuthToken();
  }).then(function (token) {
    log('An user logged in by credentials');
    res.header('x-auth', token).send((0, _extends3.default)({}, user_doc, {
      token: token
    }));
  }).catch(function (e) {
    return next(e);
  });
});

router.post('/login/token', function (req, res, next) {
  var token = req.body.token;

  var user_doc = void 0;

  User.findByToken(token).then(function (doc) {
    log('An user logged in by token');
    res.send((0, _extends3.default)({}, doc.toJSON(), {
      token: token
    }));
  }).catch(function (e) {
    return next(e);
  });
});

router.delete('/login/token', authenticate, function (req, res, next) {
  req.user.removeToken(req.token).then(function () {
    log('An user logged off');
    res.status(200).send({
      message: 'An user logged off'
    });
  }).catch(function (e) {
    return next(e);
  });
});

// router.delete('/me', authenticate, remove(User));

router.patch('/me', authenticate, function (req, res, next) {
  //Only selected_company_id can be updated.
  var company_id = req.body.selected_company_id;
  var user = req.user;
  var result = user.companies.find(function (company) {
    return company.equals(company_id);
  });
  if (result) {
    user.update({ $set: { selected_company_id: company_id } }, { new: true }).then(function (doc) {
      res.status(200).send(doc);
      log('User was updated');
    }).catch(function (e) {
      return next(e);
    });
  } else {
    next({
      message: 'Company id is not part of available companies',
      html_code: 404
    });
  }
});

router.get('/me', authenticate, function (req, res, next) {
  log('An user was sent');
  res.send((0, _extends3.default)({}, req.user.toJSON()));
});

router.use(error_handler('User'));

module.exports = router;
//# sourceMappingURL=user.js.map