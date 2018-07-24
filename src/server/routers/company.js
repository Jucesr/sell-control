import express from 'express'
import bodyParser from 'body-parser'
import {ObjectID} from 'mongodb'
import {Company} from '../models/company'
import {User} from '../models/user'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {error_handler} from '../middleware/error_handler'

import {remove} from './_base'
import {log} from '../helpers'

const router = express.Router()

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)

router.post('/', (req, res, next) => {
  if(req.user.max_companies <= req.user.companies.length){
    return next({
      message: 'User can not create more companies.',
      html_code: '400'
    })
  }

  const company = new Company({
    name: req.body.name,
    user_owner_id: req.user._id,
    users: [req.user._id]
  })

  company.create().then(
    company_doc => {
      res.status(200).send(company_doc)
      log('A company was created')
    }
  ).catch( e => next(e))
})

router.patch('/unsubscribe/user/:id', validate_company, (req, res, next) => {

  let uu_id = req.params.id
  let ut = req.user
  let company = req.company

  company.unsubscribeOtherUser(ut, uu_id).then(
    user => {
      log(`${ut.username} has unsubscribed ${user.username} from ${company.name}`)
      res.status(200).send(user)
  }).catch( e => next(e))
})

router.patch('/unsubscribe/me', validate_company, (req, res, next) => {

  let company = req.company
  let user = req.user

  company.unsubscribeUser(user).then(
    user => {
      log(`${req.user.username} has been unsubscribed from ${req.company.name}`)
      res.status(200).send(user)
  }).catch( e => next(e))
})

router.patch('/subscribe/user/:id', validate_company, (req, res, next) => {

  let company = req.company
  let ut = req.user
  let uu_id = req.params.id

  company.subscribeUser(ut, uu_id).then(
    user => {
      log(`${req.user.username} has subscribed ${user.username} to ${req.company.name}`)
      res.status(200).send(user)
  }).catch( e => next(e))
})

router.patch('/max_users/:action', validate_company, (req, res, next) => {
  let company = req.company
  let user = req.user
  let action = req.params.action //increase - decrase

  if(!user._id.equals(company.user_owner_id)){
    next({
      message: 'User cannot modify max users because is not the owner of the company',
      html_code: 401
    })
  }

  company.updateMaxUsers(action).then(
    company => {
      log(`${user.username} has ${action}d max users to ${company.max_users}`)
      res.status(200).send(company)
  }).catch( e => next(e))


});

router.patch('/user_owner_id/:id', validate_company, (req, res, next) => {
  let company = req.company
  let user = req.user
  let new_owner_id = req.params.id

  if(!user._id.equals(company.user_owner_id)){
    next({
      message: 'User cannot modify owner because is not the owner of the company',
      html_code: 401
    })
  }

  company.changeOwner(new_owner_id).then(
    new_owner => {
      log(`${user.username} has named ${new_owner.username} owner of ${company.name}`)
      res.status(200).send(company)
  }).catch( e => next(e))


});

router.get('/', authenticate, validate_company, (req, res, next) =>{

  let company = req.company
  let user = req.user

  if(!user._id.equals(company.user_owner_id)){
    next({
      message: 'User cannot get this company because is not the owner',
      html_code: 401
    })
  }

  company.populateUsers().then(
    company => {
      log(`A company was sent`)
      res.status(200).send(company)
  }).catch( e => next(e))


})

// router.delete('/:id', remove(Company))

router.use(error_handler('Company'))

export default router
