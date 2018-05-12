const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Client} = require('../models/client');
const {authenticate} = require('../middleware/authenticate');
const {verify_company} = require('../middleware/verify_company');

const {getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', (req, res) => {
  const client = new Client({
    ...req.body
  });

  client.save().then(
    doc => {
      res.send(doc);
      console.log('A client was saved');
    }, e => {
      res.status(400).send(e);
      console.log('Error has occurred while saving client', e);
    }
  )
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('ID has invalid format');
  }

  Client.findOneAndRemove({
    _id: id,
  }).then( (doc) => {

    if(!doc)
      return res.status(404).send('No client was found');

    res.status(200).send(doc);
    console.log('A client was deleted');

  }).catch( (e) => {
    console.log('Error has occurred while deleting clients', e);
    res.status(404).send(e)
  });

});

router.patch('/:id', (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send('ID has invalid format');

  Client.findOneAndUpdate( {
    _id: id
  }, { $set: req.body}, { new: true }).then(
    (doc) => {
      if(!doc)
        return res.status(404).send('No client was found');
      res.status(200).send(doc);
      console.log('A client was updated');
    }).catch( (e) => {
    console.log('Error has occurred while updating clients', e);
    res.status(404).send(e);
  } );


});

router.get('/', getAll(Client));


module.exports = router
