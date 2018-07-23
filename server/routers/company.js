const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Company} = require('../models/company')
const {User} = require('../models/user')

const {authenticate} = require('../middleware/authenticate')
const {validate_company} = require('../middleware/validate_company')
const {error_handler} = require('../middleware/error_handler')

const {remove, update, getAll, getByID} = require('./_base')
const {log} = require('../helpers')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)

router.post('/', (req, res, next) => {
  if(req.user.max_companies <= req.user.companies.length){
    return next({
      message: 'User can not create more companies.',
      html_code: '400'
    });
  }

  const company = new Company({
    name: req.body.name,
    user_owner_id: req.user._id,
    users: [req.user._id]
  });

  company.save().then(
    company_doc => {
      res.status(200).send(company_doc);
      log('A company was created');
    }
  ).catch( e => next(e));
});

router.patch('/unsubscribe/user/:id', validate_company, (req, res, next) => {

  let uu_id = req.params.id
  let ut = req.user
  let company = req.company

  company.unsubscribeUser(ut, uu_id).then(
    user => {
      log(`${ut.username} has unsubscribed ${user.username} from ${company.name}`)
      res.status(200).send(user)
  }).catch( e => next(e))
});

router.patch('/unsubscribe/me', validate_company, (req, res, next) => {
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
    return next({
      message: 'User cannot be unsubscribed because is the only owner of the company',
      html_code: 401
    })
  }
  req.user.removeCompany(company_id).then(
    user => {
      log(`${req.user.username} has been unsubscribed from ${req.company.name}`);
      res.status(200).send(user);
  }).catch( e => next(e));
});

// router.delete('/:id', remove(Company));

// router.patch('/:id', update(Company));

// router.get('/:id', getByID(Company));

router.get('/', getAll(Company));

router.use(error_handler('Company'))


module.exports = router
