const express = require('express')
const {ObjectID} = require('mongodb')
const bodyParser = require('body-parser')
const router = express.Router()
const {Product} = require('../models/product')
const {Supplier} = require('../models/supplier')

const {authenticate} = require('../middleware/authenticate')
const {validate_company} = require('../middleware/validate_company')
const {error_handler} = require('../middleware/error_handler')
const {add, remove, update, getByID, getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(validate_company)

router.post('/', add(Product) );

router.delete('/:id', remove(Product));

router.patch('/:id', update(Product));

router.get('/:id', getByID(Product));

router.get('/', getAll(Product));

router.use(error_handler('Product'))

module.exports = router
