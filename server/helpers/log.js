"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var log = exports.log = function log(message, e) {
  if (!process.env.LOG) {
    console.log(message);
    if (e) console.error(e);
  }
};
//# sourceMappingURL=log.js.map