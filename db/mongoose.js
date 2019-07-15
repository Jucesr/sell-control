import mongoose from 'mongoose'
import {log} from '../helpers'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
  .then(
    () => log('A connection was successfully established with mongodb'),
    e => log(e));

module.exports = {
  mongoose
};
