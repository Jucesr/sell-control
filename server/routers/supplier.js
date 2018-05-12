const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Supplier} = require('../models/supplier');

const {authenticate} = require('../middleware/authenticate');
const {verify_company} = require('../middleware/verify_company');
const {getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', (req, res) => {
  const supplier = new Supplier({
    ...req.body
  });

  supplier.save().then(
    doc => {
      res.send(doc);
      console.log('A supplier was saved');
    }, e => {
      res.status(400).send(e);
      console.log('Error has occurred while saving supplier', e);
    }
  )
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('ID has invalid format');
  }

  Supplier.findOneAndRemove({
    _id: id,
  }).then( (doc) => {

    if(!doc)
      return res.status(404).send('No supplier was found');

    res.status(200).send(doc);
    console.log('A supplier was deleted');

  }).catch( (e) => {
    console.log('Error has occurred while deleting suppliers', e);
    res.status(404).send(e)
  });

});

router.patch('/:id', (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send('ID has invalid format');

  Supplier.findOneAndUpdate( {
    _id: id
  }, { $set: req.body}, { new: true }).then(
    (doc) => {
      if(!doc)
        return res.status(404).send('No supplier was found');
      res.status(200).send(doc);
      console.log('A supplier was updated');
    }).catch( (e) => {
    console.log('Error has occurred while updating suppliers', e);
    res.status(404).send(e);
  } );


});

router.get('/', getAll(Supplier));


module.exports = router
