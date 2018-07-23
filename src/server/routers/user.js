import express from 'express'
import bodyParser from 'body-parser'
import {ObjectID} from 'mongodb'
import mongoose from 'mongoose'
import {User} from '../models/user'
import {Company} from '../models/company'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {error_handler} from '../middleware/error_handler'
import {remove, update, getAll} from './_base'
import {log} from '../helpers'

const router = express.Router()

router.use(bodyParser.json())

router.post('/', (req, res, next) => {

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  let user_doc
  user.save().then(
    doc => {
      user_doc = doc.toJSON()
      log('An user was created')
      return user.generateAuthToken()
    }
  ).then(
    token => {
      res.header('x-auth', token).send({
        ...user_doc,
        token
      })
  }).catch( e => next(e))
})

router.post('/login', (req, res, next) => {
    let {email, password, username} = req.body

    let user_doc

    User.findByCredentials(username, email, password).then(
      doc => {
        user_doc = doc.toJSON()
        return doc.generateAuthToken()
      }).then( (token) =>{
        log('An user logged in by credentials')
        res.header('x-auth',token).send({
          ...user_doc,
          token
        })
      }).catch( e => next(e))
})

router.post('/login/token', (req, res, next) => {
  let {token} = req.body
  let user_doc

  User.findByToken(token).then(
    doc => {
      log('An user logged in by token')
      res.send({
        ...doc.toJSON(),
        token
      })
    }).catch( e => next(e))
})

router.delete('/login/token', authenticate,  (req, res, next) => {
  req.user.removeToken(req.token).then( () => {
    log('An user logged off')
    res.status(200).send({
      message:'An user logged off'
    })
  }).catch( e => next(e))
})

// router.delete('/me', authenticate, remove(User))

router.patch('/select/company/:id', authenticate, (req, res, next) => {
  let company_id = req.params.id
  let user = req.user

  user.selectCompany(company_id).then(
    doc => {
      res.status(200).send(doc)
      log(`${user.username} has select ${company_id}`)
    }
  ).catch( e => next(e))

})

router.get('/me', authenticate, (req, res, next) =>{
  log('An user was sent')
  res.send({
    ...req.user.toJSON()
  })
})

router.use(error_handler('User'))

export default router
