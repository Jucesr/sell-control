const express = require('express')

const validate_company = require('../middleware/validate_company')
const error_handler = require('../middleware/error_handler')
const authenticate = require('../middleware/authenticate')
const logService = require('../services/log.service');
const async_handler = require('express-async-handler')
const addcrudRoutes = require('./_crud')
const _ = require('lodash');

const User = require('../models/user');

let router = express.Router()

const fieldsToInclude = [
  'username',
  'email',
  'password'
]

const fieldsToUpdate = [
  'password',
]

router = addcrudRoutes({
  model: User,
  router,
  fields: {
    toAdd: fieldsToInclude,
    toUpdate: fieldsToUpdate
  },
  exclude: {
    getByID: true,
    getAll: true,
    delete: true,
    update: true,
  }
})

//--------------------------------------------------------------------------------------
//  Additional routes.
//--------------------------------------------------------------------------------------

router.post('/login', async_handler (async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  const user = await User.findByCredentials({
    email: body.email,
    password: body.password
  })
  const token = await user.generateAuthToken()
  
  res.send({
    ...user.toJSON(),
    token
  });
  logService.log(`${user.email} has logged in`)

}));

router.use(error_handler('User'))

router.post('/login/token', async_handler (async (req, res, next) => {
  let { token } = req.body

  const user = await User.findByToken(token)
  
  logService.log('An user logged in by token')

  res.send({
    ...user.toJSON(),
    token
  })

}));

router.delete('/login/token', authenticate, async_handler (async (req, res, next) => {

  const user = await req.user.removeToken(req.token)

  logService.log('An user logged off')

  res.send({
    message: 'An user logged off'
  })

}));

// router.delete('/me', authenticate, (req, res, next) => {
//   let user = req.user

//   user.customRemove().then(
//     doc => {
//       res.status(200).send(doc)
//       log(`${doc.username} has been removed`)
//     }
//   ).catch(e => next(e))
// })

// router.patch('/select/company/:id', authenticate, (req, res, next) => {
//   let company_id = req.params.id
//   let user = req.user

//   user.selectCompany(company_id).then(
//     doc => {
//       res.status(200).send(doc)
//       log(`${user.username} has select ${company_id}`)
//     }
//   ).catch(e => next(e))

// })

router.get('/me', authenticate, (req, res, next) => {

  let user = req.user

  user.populateCompanies().then(user => {
    logService.log('An user was sent');
    res.status(200).send(user)
  }).catch(e => next(e))
})

module.exports = router

