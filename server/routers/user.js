const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {User} = require('../models/user');

const {authenticate} = require('../middleware/authenticate');
const {remove, update, getAll} = require('./_base')

const error_message = action => `An error has occurred while ${action} user`
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
});

router.post('/login/token', (req, res) => {
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
});

router.delete('/login/token', authenticate,  remove(User));

router.patch('/:id', authenticate, update(User));

router.get('/', authenticate, getAll(User));

module.exports = router
