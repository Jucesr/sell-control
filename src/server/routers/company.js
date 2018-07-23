import express from 'express'
import bodyParser from 'body-parser'
import {ObjectID} from 'mongodb'
import {Company} from '../models/company'
import {User} from '../models/user'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {error_handler} from '../middleware/error_handler'

import {remove, update, getAll, getByID} from './_base'
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
    });
  }

  const company = new Company({
    name: req.body.name,
    user_owner_id: req.user._id,
    users: [req.user._id]
  });

  company.create().then(
    company_doc => {
      res.status(200).send(company_doc);
      log('A company was created');
    }
  ).catch( e => next(e));
});

router.patch('/unsubscribe/user/:id', validate_company, (req, res, next) => {

  let uu_id = req.params.id
  let ut = req.user
  let company = req.company

  company.unsubscribeOtherUser(ut, uu_id).then(
    user => {
      log(`${ut.username} has unsubscribed ${user.username} from ${company.name}`)
      res.status(200).send(user)
  }).catch( e => next(e))
});

router.patch('/unsubscribe/me', validate_company, (req, res, next) => {

  let company = req.company
  let user = req.user

  company.unsubscribeUser(user).then(
    user => {
      log(`${req.user.username} has been unsubscribed from ${req.company.name}`);
      res.status(200).send(user);
  }).catch( e => next(e));
});

router.patch('/subscribe/user/:id', validate_company, (req, res, next) => {

  let company = req.company
  let ut = req.user
  let uu_id = req.params.id

  company.subscribeUser(ut, uu_id).then(
    user => {
      log(`${req.user.username} has subscribed ${user.username} to ${req.company.name}`);
      res.status(200).send(user);
  }).catch( e => next(e));
});

// router.delete('/:id', remove(Company));

// router.patch('/:id', update(Company));

// router.get('/:id', getByID(Company));

router.get('/', getAll(Company));

router.use(error_handler('Company'))


export default router
