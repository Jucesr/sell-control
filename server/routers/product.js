const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Product} = require('../models/product');

// middleware that is specific to this router
router.use(bodyParser.json())

router.post('/', (req, res) => {
  const product = new Product({
    ...req.body
  });

  product.save().then(
    doc => {
      res.send(doc);
      console.log('A product was saved');
    }, e => {
      res.status(400).send(e);
      console.log('Error has occurred');
    }
  )
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('ID has invalid format');
  }

  Product.findOneAndRemove({
    _id: id,
  }).then( (doc) => {

    if(!doc)
      return res.status(404).send('No product was found');

    res.status(200).send(doc);
    console.log('A product was deleted');

  }).catch( (e) => res.status(404).send(e));

});

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
    res.status(404).send(e);
  } );


});

router.get('/',  (req, res) => {

  Product.getAll().then(
    (products) => {
      res.send(products);
      console.log('products were sent');
    }, e => {
      res.status(404).send(e);
      console.log('Error has occurred');
    }
  );
});


module.exports = router
