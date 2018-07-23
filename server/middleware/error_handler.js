'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error_handler = undefined;

var _log = require('../helpers/log');

var error_handler = exports.error_handler = function error_handler(entity, action) {
  return function (e, req, res, next) {
    var error_message = e.message || e.errmsg || e.error || e.error_message;
    res.status(e.html_code || 400).send({
      error: error_message
    });
    (0, _log.log)('Error has occurred in ' + entity + ' ' + (action ? 'while ' + action : '') + ' ', e);
  };
};
//# sourceMappingURL=error_handler.js.map