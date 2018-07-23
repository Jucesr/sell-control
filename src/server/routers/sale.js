import express from 'express'
import bodyParser from 'body-parser'
import {Sale} from '../models/sale'
import {Product} from '../models/product'
import {Client} from '../models/client'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {add, remove, update, getByID, getAll} from './_base'
import {log, error_handler} from '../helpers'

const router = express.Router()

router.use(bodyParser.json())
router.use(authenticate)
router.use(validate_company)

router.post('/', (req, res, next) => {
  let client_id =
  Client.findById(client_id).then(
    doc => {
      if(!doc){
        req.body.client_id = ''
      }
    }
  )
}, add(Sale) )

router.delete('/:id', remove(Sale))

router.patch('/:id', update(Sale))

router.get('/:id', getByID(Sale))

router.get('/', getAll(Sale))

export default router
