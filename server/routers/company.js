const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Company} = require('../models/company');
const {User} = require('../models/user');

const {authenticate} = require('../middleware/authenticate');
const {remove, update, getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)

router.post('/', (req, res) => {

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
        return res.status(400).send({
          error: 'Could not update user company_id'
        })
      res.status(200).send(company_doc);
      console.log('A company was created');
    }
  ).catch( (e) => {
    console.error('Error has occurred while saving company', e);
    res.status(404).send(e);
  });
});

router.delete('/:id', remove(Company));

router.patch('/:id', update(Company));

router.get('/', getAll(Company));


module.exports = router
