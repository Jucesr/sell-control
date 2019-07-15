
const express = require('express')
const validate_company = require('../middleware/validate_company')
const error_handler = require('../middleware/error_handler')
const authenticate = require('../middleware/authenticate')
const addcrudRoutes = require('./_crud')

const Client = require('../models/client');

// const path = require('path');
// const {replaceAll} = require('../utils/utils')
// const async_handler = require('express-async-handler')

let router = express.Router()

const fieldsToInclude = [
  "company_id",
  "first_name",
  "last_name",
  "address",
  "email",
  "phone"
]

const fieldsToUpdate = [
  "first_name",
  "last_name",
  "address",
  "email",
  "phone"
]

router.use(authenticate)
router.use(validate_company)

router = addcrudRoutes({
    model: Client,
    router,
    fields: {
        toAdd: fieldsToInclude,
        toUpdate: fieldsToUpdate
    }
})

router.use(error_handler('Client'))

module.exports = router;