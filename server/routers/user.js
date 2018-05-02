const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {User} = require('../models/user');

// middleware that is specific to this router
router.use(bodyParser.json())

router.post('/', (req, res) => {
  const user = new User({
    ...req.body
  });

  user.save().then(
    doc => {
      console.log('A user was saved');
      return user.generateAuthToken();
    }
  ).then(
    token => {
      res.header('x-auth', token).send(user)
    }
  ).catch(
    e => {
      res.status(400).send(e);
      console.log('Error has occurred while saving user', e);
    }
  )
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send('ID has invalid format');
  }

  User.findOneAndRemove({
    _id: id,
  }).then( (doc) => {

    if(!doc)
      return res.status(404).send('No user was found');

    res.status(200).send(doc);
    console.log('A user was deleted');

  }).catch( (e) => {
    console.log('Error has occurred while deleting users', e);
    res.status(404).send(e)
  });

});

router.patch('/:id', (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id))
    return res.status(404).send('ID has invalid format');

  User.findOneAndUpdate( {
    _id: id
  }, { $set: req.body}, { new: true }).then(
    (doc) => {
      if(!doc)
        return res.status(404).send('No user was found');
      res.status(200).send(doc);
      console.log('A user was updated');
    }).catch( (e) => {
    console.log('Error has occurred while updating users', e);
    res.status(404).send(e);
  } );


});

router.get('/',  (req, res) => {

  User.getAll().then(
    (users) => {
      res.send(users);
      console.log('users were sent');
    }, e => {
      res.status(404).send(e);
      console.log('Error has occurred while sending users', e);
    }
  );
});


module.exports = router
