'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _client = require('../models/client');

var _authenticate = require('../middleware/authenticate');

var _validate_company = require('../middleware/validate_company');

var _error_handler = require('../middleware/error_handler');

var _base = require('./_base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// middleware that is specific to this router
router.use(_bodyParser2.default.json());
router.use(_authenticate.authenticate);
router.use(_validate_company.validate_company);

router.post('/', (0, _base.add)(_client.Client));

router.delete('/:id', (0, _base.remove)(_client.Client));

router.patch('/:id', (0, _base.update)(_client.Client));

router.get('/:id', (0, _base.getByID)(_client.Client));

router.get('/', (0, _base.getAll)(_client.Client));

router.use((0, _error_handler.error_handler)('Client'));

module.exports = router;
//# sourceMappingURL=client.js.map