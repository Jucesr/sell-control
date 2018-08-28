import express from 'express'
import bodyParser from 'body-parser'
import {Sale} from '../models/sale'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {add, remove, update, getByID, getAll} from './_base'
import {error_handler} from '../middleware/error_handler'

const router = express.Router()

router.use(bodyParser.json())
router.use(authenticate)
router.use(validate_company)

router.post('/',(req, res, next) => {
  //Add user_id to the body
  console.log(req.body);
  
  req.body.user_id = req.user._id
  next();
}, add(Sale) )

router.delete('/:id', remove(Sale))

router.patch('/:id', update(Sale))

router.get('/:id', getByID(Sale))

router.get('/', getAll(Sale))

router.use(error_handler('Sale'))

export default router
