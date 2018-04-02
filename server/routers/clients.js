const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Client} = require('../models/client');

// middleware that is specific to this router
router.use(bodyParser.json())

router.post('/', (req, res) => {
  const client = new Client({
    ...req.body
  });

  client.save().then(
      doc => {
        res.send(doc);
        console.log('A client was saved');
      }
    ).catch(
      e => {
        res.status(404).send(e);
        console.error('Error has occurred while saving client', e);
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

  }).catch(
    e => {
      res.status(404).send(e);
      console.error('Error has occurred while deleting client', e);
    }
  )

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
    }).catch(
      e => {
        res.status(404).send(e);
        console.error('Error has occurred while updating client', e);
      }
    );


});

router.get('/',  (req, res) => {

  Client.getAll().then(
    (clients) => {
      res.send(clients);
      console.log('client were sent');
    }, e => {
      res.status(404).send(e);
      console.log('Error has occurred');
    }
  );
});


module.exports = router
