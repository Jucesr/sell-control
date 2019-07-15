const mongoose = require('mongoose');

const {MONGODB_URI} = process.env

mongoose.Promise = global.Promise;

module.exports = () => {
    return mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true,
      useCreateIndex: true, 
    })
};
