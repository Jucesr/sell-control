const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {Client} = require('../models/client');

const {authenticate} = require('../middleware/authenticate');
const {verify_company} = require('../middleware/verify_company');
const {add, remove, update, getByID, getAll} = require('./_base')

// middleware that is specific to this router
router.use(bodyParser.json())
router.use(authenticate)
router.use(verify_company)

router.post('/', add(Client) );

router.delete('/:id', remove(Client));

router.patch('/:id', update(Client));

router.get('/:id', getByID(Client));

router.get('/', getAll(Client));

module.exports = router
