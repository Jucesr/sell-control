'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test' || env === 'jest') {
  var config = {
    test: {
      port: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/sellControlTest',
      JWT_SECRET: 'thisrandomishardfixtoastring'
    },
    development: {
      port: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/sellControl',
      JWT_SECRET: 'jksjdkjbh3hbj3hjbjh3bjhda2'
    },
    jest: {
      port: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/sellControlTest',
      JWT_SECRET: 'thisrandomishardfixtoastring'
    }
  };
  var envConfig = config[env];

  (0, _keys2.default)(envConfig).forEach(function (key) {
    process.env[key] = envConfig[key];
  });
}
//# sourceMappingURL=config.js.map