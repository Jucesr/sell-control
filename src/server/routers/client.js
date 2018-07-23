import express from 'express'
import bodyParser from 'body-parser'

import {Client} from '../models/client'
import {authenticate} from '../middleware/authenticate'
import {validate_company} from '../middleware/validate_company'
import {error_handler} from '../middleware/error_handler'
import {add, remove, update, getByID, getAll} from './_base'

const router = express.Router()

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(validate_company)

router.post('/', add(Client) );

router.delete('/:id', remove(Client));

router.patch('/:id', update(Client));

router.get('/:id', getByID(Client));

router.get('/', getAll(Client));

router.use(error_handler('Client'))

module.exports = router
