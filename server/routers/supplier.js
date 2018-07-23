'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var _require = require('../models/supplier'),
    Supplier = _require.Supplier;

var _require2 = require('../middleware/authenticate'),
    authenticate = _require2.authenticate;

var _require3 = require('../middleware/validate_company'),
    validate_company = _require3.validate_company;

var _require4 = require('../middleware/error_handler'),
    error_handler = _require4.error_handler;

var _require5 = require('./_base'),
    add = _require5.add,
    remove = _require5.remove,
    update = _require5.update,
    getByID = _require5.getByID,
    getAll = _require5.getAll;

// middleware that is specific to this router


router.use(bodyParser.json());
router.use(authenticate);
router.use(validate_company);

router.post('/', add(Supplier));

router.delete('/:id', remove(Supplier));

router.patch('/:id', update(Supplier));

router.get('/:id', getByID(Supplier));

router.get('/', getAll(Supplier));

router.use(error_handler('Supplier'));

module.exports = router;
//# sourceMappingURL=supplier.js.map