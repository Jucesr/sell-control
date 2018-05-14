const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {ObjectID} = require('mongodb')
const {Product} = require('../models/product');

const {authenticate} = require('../middleware/authenticate');
const {verify_company} = require('../middleware/verify_company');
const {add, remove, update, getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', add(Product) );

router.delete('/:id', remove(Product));

router.patch('/:id', update(Product));

router.get('/', getAll(Product));


module.exports = router
