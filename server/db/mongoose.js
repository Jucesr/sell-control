'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(process.env.MONGODB_URI).then(function () {
  return (0, _helpers.log)('A connection was successfully established with mongodb');
}, function (e) {
  return (0, _helpers.log)(e);
});

module.exports = {
  mongoose: _mongoose2.default
};
//# sourceMappingURL=mongoose.js.map