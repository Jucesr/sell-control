const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => console.log('A connection was successfully established with mongodb'),
    e => console.log(e));

module.exports = {
  mongoose
};
