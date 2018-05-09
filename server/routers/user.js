const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {User} = require('../models/user');
const {objectHasProperties} = require('../helpers')

const error_message = action => `An error has occurred while ${action} user`
const missingPropertiesError = {
  error: 'Properties were not provided'
}
// middleware that is specific to this router
router.use(bodyParser.json())


router.post('/', (req, res) => {
  const user = new User({
    ...req.body
  });
  let user_doc;
  user.save().then(
    doc => {
      user_doc = doc.toJSON();
      console.log('An user was created');
      return user.generateAuthToken();
    }
  ).then(
    token => {
      res.header('x-auth', token).send({
        ...user_doc,
        token
      })
    }
  ).catch(
    e => {
      res.status(400).send(e);
      console.log(error_message('saving'), e);
    }
  )
});

router.post('/login', (req, res) => {

  if(objectHasProperties(req.body, ['email','password'])){
    let {email, password} = req.body

    var user_doc;

    User.findByCredentials(email, password).then(
      doc => {
        user_doc = doc.toJSON();
        return doc.generateAuthToken()
      }).then( (token) =>{
        console.log('An user was login in by credentials');
        res.header('x-auth',token).send({
          ...user_doc,
          token
        });
      }).catch( (e) => {
        res.status(400).send(e);
        console.log(error_message('logging'), e);
      });
  }else{
    res.status(400).send(missingPropertiesError)
    console.log(error_message('logging'), missingPropertiesError);
  }
});

router.post('/login/token', (req, res) => {

  if(objectHasProperties(req.body, ['token'])){
    let {token} = req.body
    var user_doc;

    User.findByToken(token).then(
      doc => {
        console.log('A user was login in by token');
        res.send({
          ...doc.toJSON(),
          token
        })
      }).catch( (e) => {
        res.status(400).send(e);
        console.log(error_message('logging'), e);
      });
    }else{
      res.status(400).send(missingPropertiesError)
      console.log(error_message('logging'), missingPropertiesError);
    }
});

router.delete('/login/token', (req, res) => {

  if(objectHasProperties(req.body, ['token'])){
    let {token} = req.body

    User.findByToken(token).then(
      doc => doc.removeToken(token))
      .then( () =>{
        console.log('An user has logged off');
        res.send({});
      }).catch( (e) => {
        res.status(400).send(e);
        console.log(error_message('logging'), e);
      });
    }else{
      res.status(400).send(missingPropertiesError)
      console.log(error_message('logging'), missingPropertiesError);
    }
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
