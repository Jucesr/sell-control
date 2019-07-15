const express = require('express')
const validate_company = require('../middleware/validate_company')
const error_handler = require('../middleware/error_handler')
const authenticate = require('../middleware/authenticate')
const addcrudRoutes = require('./_crud')

const Supplier = require('../models/supplier');

let router = express.Router()

router.use(authenticate)
router.use(validate_company)

router = addcrudRoutes({
  model: Supplier,
  router
})

router.use(error_handler('Supplier'))

module.exports = router
