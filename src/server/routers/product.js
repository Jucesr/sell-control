import express from 'express'
import {ObjectID} from 'mongodb'
import bodyParser from 'body-parser'
import {Product} from '../models/product'
import {Supplier} from '../models/supplier'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {error_handler} from '../middleware/error_handler'
import {add, remove, update, getByID, getAll} from './_base'

const router = express.Router()

router.use(bodyParser.json())
router.use(authenticate)
router.use(validate_company)

router.post('/', add(Product) )

router.delete('/:id', remove(Product))

router.patch('/:id', update(Product))

router.get('/:id', getByID(Product))

router.get('/', getAll(Product))

router.use(error_handler('Product'))

export default router
