const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Product} = require('../models/product');

const {authenticate} = require('../middleware/authenticate');
const {verify_company} = require('../middleware/verify_company');
const {add, remove, getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', add(Product) );

router.delete('/:id', remove(Product));

router.patch('/:id', (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send('ID has invalid format');

  Product.findOneAndUpdate( {
    _id: id
  }, { $set: req.body}, { new: true }).then(
    (doc) => {
      if(!doc)
        return res.status(404).send('No product was found');
      res.status(200).send(doc);
      console.log('A product was updated');
    }).catch( (e) => {
    console.log('Error has occurred while updating products', e);
    res.status(404).send(e);
  } );


});

router.get('/', getAll(Product));


module.exports = router
