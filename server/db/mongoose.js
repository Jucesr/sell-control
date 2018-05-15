const mongoose = require('mongoose');
const {log} = require('../helpers')

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => log('A connection was successfully established with mongodb'),
    e => log(e));

module.exports = {
  mongoose
};
