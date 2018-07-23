'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var _require = require('../models/sale'),
    Sale = _require.Sale;

var _require2 = require('../models/product'),
    Product = _require2.Product;

var _require3 = require('../models/client'),
    Client = _require3.Client;

var _require4 = require('../middleware/authenticate'),
    authenticate = _require4.authenticate;

var _require5 = require('../middleware/validate_company'),
    validate_company = _require5.validate_company;

var _require6 = require('./_base'),
    add = _require6.add,
    remove = _require6.remove,
    update = _require6.update,
    getByID = _require6.getByID,
    getAll = _require6.getAll;

var _require7 = require('../helpers'),
    log = _require7.log,
    error_handler = _require7.error_handler;

// middleware that is specific to this router


router.use(bodyParser.json());
router.use(authenticate);
router.use(validate_company);

router.post('/', function (req, res, next) {
  var client_id = Client.findById(client_id).then(function (doc) {
    if (!doc) {
      req.body.client_id = '';
    }
  });
}, add(Sale));

router.delete('/:id', remove(Sale));

router.patch('/:id', update(Sale));

router.get('/:id', getByID(Sale));

router.get('/', getAll(Sale));

module.exports = router;
//# sourceMappingURL=sale.js.map