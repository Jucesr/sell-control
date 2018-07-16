const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Company} = require('../models/company')
const {User} = require('../models/user')

const {authenticate} = require('../middleware/authenticate')
const {error_handler} = require('../middleware/error_handler')

const {remove, update, getAll} = require('./_base')
const {log} = require('../helpers')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)

router.post('/', (req, res, next) => {

  let company_doc;

  const company = new Company({
    ...req.body,
    user_owner_id: req.user._id
  });

  company.save().then(
    doc => {
      company_doc = doc;
      return User.findOneAndUpdate({
        _id: req.user._id
      }, {
        $set: {
          company_id: doc._id
        }
      }, {
        new: true
      })
    }
  ).then(
    user_doc => {
      if(!user_doc)
        return next({
          message: 'Could not update user company_id',
          html_code: 400
        })
      res.status(200).send(company_doc);
      log('A company was created');
    }
  ).catch( e => next(e));
});

router.delete('/:id', remove(Company));

router.patch('/:id', update(Company));

router.get('/', getAll(Company));

router.use(error_handler('Company'))


module.exports = router
