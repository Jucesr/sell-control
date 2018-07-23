'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pre_save_trim = function pre_save_trim(next) {
  var paths = this.schema.paths;
  (0, _keys2.default)(paths).forEach(function (field) {
    if (paths[field].instance != 'String') {
      return;
    }

    var value = this[field];

    if (!value) {
      return;
    }

    var trimmedValue = value.trim();

    if (trimmedValue != value) {
      this[field] = trimmedValue;
    }
  }, this);

  next();
};

module.exports = { pre_save_trim: pre_save_trim };
//# sourceMappingURL=pre_trim.js.map