'use strict';

var express = require('express');

var _require = require('mongodb'),
    ObjectID = _require.ObjectID;

var bodyParser = require('body-parser');
var router = express.Router();

var _require2 = require('../models/product'),
    Product = _require2.Product;

var _require3 = require('../models/supplier'),
    Supplier = _require3.Supplier;

var _require4 = require('../middleware/authenticate'),
    authenticate = _require4.authenticate;

var _require5 = require('../middleware/validate_company'),
    validate_company = _require5.validate_company;

var _require6 = require('../middleware/error_handler'),
    error_handler = _require6.error_handler;

var _require7 = require('./_base'),
    add = _require7.add,
    remove = _require7.remove,
    update = _require7.update,
    getByID = _require7.getByID,
    getAll = _require7.getAll;

// middleware that is specific to this router


router.use(bodyParser.json());
router.use(authenticate);
router.use(validate_company);

router.post('/', add(Product));

router.delete('/:id', remove(Product));

router.patch('/:id', update(Product));

router.get('/:id', getByID(Product));

router.get('/', getAll(Product));

router.use(error_handler('Product'));

module.exports = router;
//# sourceMappingURL=product.js.map