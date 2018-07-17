const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Company} = require('../models/company')

const {authenticate} = require('../middleware/authenticate')
const {error_handler} = require('../middleware/error_handler')

const {remove, update, getAll, getByID} = require('./_base')
const {log} = require('../helpers')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)

router.post('/', (req, res, next) => {
  if(req.user.max_companies <= req.user.companies.length){
    return next({
      message: 'User can not create more companies. Max companies number reached',
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
      if(!company_doc)
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

router.get('/:id', getByID(Company));

router.get('/', getAll(Company));

router.use(error_handler('Company'))


module.exports = router
