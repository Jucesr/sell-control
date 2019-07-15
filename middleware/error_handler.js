// TODO: Make a tryToParseError.
const logService = require('../services/log.service')
const {EXPEDIENTE_DUPLICATED, LIMIT_FILE_SIZE} = require('../config/errors')

module.exports = (entity) => {
  return (e, req, res, next) => {

    let error = {
      user_message: '',
      console_message: ''
    };

    if(e.isCustomError){

      error.user_message = e.body
      error.console_message = e.body
    
    }else{
      if(e.code == "LIMIT_FILE_SIZE"){
        error.user_message = LIMIT_FILE_SIZE
      }else if(e.code == '11000'){
        error.user_message = EXPEDIENTE_DUPLICATED

      }else if(e.name == 'ValidationError'){
        error.user_message = e.message
      }else{
        //  Unhandled error
        error.user_message = e
      }

      error.console_message = e
      
    }

      res.status(e.html_code || 400).send({
        error: error.user_message
      });

    logService.log(`\n\nAn error has occurred in route '${entity}'`, error.console_message);
  }
}
