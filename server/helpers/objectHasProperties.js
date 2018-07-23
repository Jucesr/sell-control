"use strict";

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var objectHasProperties = function objectHasProperties(obj, properties) {
  if (Array.isArray(properties) && (typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj)) == "object") {
    return properties.reduce(function (acum, prop) {
      return acum && obj.hasOwnProperty(prop);
    }, true);
  } else {
    return false;
  }
};
//# sourceMappingURL=objectHasProperties.js.map