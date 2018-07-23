const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const {Sale} = require('../models/sale')
const {Product} = require('../models/product')
const {Client} = require('../models/client')

const {authenticate} = require('../middleware/authenticate')
const {validate_company} = require('../middleware/validate_company')
const {add, remove, update, getByID, getAll} = require('./_base')
const {log, error_handler} = require('../helpers')

// middleware that is specific to this router
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
}, add(Sale) );

router.delete('/:id', remove(Sale));

router.patch('/:id', update(Sale));

router.get('/:id', getByID(Sale));

router.get('/', getAll(Sale));

module.exports = router
