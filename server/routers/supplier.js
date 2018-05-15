const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {Supplier} = require('../models/supplier');

const {authenticate} = require('../middleware/authenticate');
const {verify_company} = require('../middleware/verify_company');
const {add, remove, update, getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', add(Supplier) );

router.delete('/:id', remove(Supplier));

router.patch('/:id', update(Supplier));

router.get('/', getAll(Supplier));

module.exports = router
