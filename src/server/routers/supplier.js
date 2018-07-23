import express from 'express'
import bodyParser from 'body-parser'
import {Supplier} from '../models/supplier'

import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {error_handler} from '../middleware/error_handler'
import {add, remove, update, getByID, getAll} from './_base'

const router = express.Router()

router.use(bodyParser.json())
router.use(authenticate)
router.use(validate_company)

router.post('/', add(Supplier) )

router.delete('/:id', remove(Supplier))

router.patch('/:id', update(Supplier))

router.get('/:id', getByID(Supplier))

router.get('/', getAll(Supplier))

router.use(error_handler('Supplier'))

export default router
