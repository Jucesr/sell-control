'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _company = require('../models/company');

var _user = require('../models/user');

var _authenticate = require('../middleware/authenticate');

var _validate_company = require('../middleware/validate_company');

var _error_handler = require('../middleware/error_handler');

var _base = require('./_base');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// middleware that is specific to this router
router.use(_bodyParser2.default.json());
router.use(_authenticate.authenticate);

router.post('/', function (req, res, next) {
  if (req.user.max_companies <= req.user.companies.length) {
    return next({
      message: 'User can not create more companies.',
      html_code: '400'
    });
  }

  var company = new _company.Company({
    name: req.body.name,
    user_owner_id: req.user._id,
    users: [req.user._id]
  });

  company.save().then(function (company_doc) {
    res.status(200).send(company_doc);
    (0, _helpers.log)('A company was created');
  }).catch(function (e) {
    return next(e);
  });
});

router.patch('/unsubscribe/user/:id', _validate_company.validate_company, function (req, res, next) {

  var uu_id = req.params.id;
  var ut = req.user;
  var company = req.company;

  company.unsubscribeOtherUser(ut, uu_id).then(function (user) {
    (0, _helpers.log)(ut.username + ' has unsubscribed ' + user.username + ' from ' + company.name);
    res.status(200).send(user);
  }).catch(function (e) {
    return next(e);
  });
});

router.patch('/unsubscribe/me', _validate_company.validate_company, function (req, res, next) {

  var company = req.company;
  var user = req.user;

  company.unsubscribeUser(user).then(function (user) {
    (0, _helpers.log)(req.user.username + ' has been unsubscribed from ' + req.company.name);
    res.status(200).send(user);
  }).catch(function (e) {
    return next(e);
  });
});

// router.delete('/:id', remove(Company));

// router.patch('/:id', update(Company));

// router.get('/:id', getByID(Company));

router.get('/', (0, _base.getAll)(_company.Company));

router.use((0, _error_handler.error_handler)('Company'));

exports.default = router;
//# sourceMappingURL=company.js.map