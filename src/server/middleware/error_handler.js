import {log} from '../helpers/log'

export const error_handler = (entity, action) => {
  return (e, req, res, next) => {
    let error_message = e.message || e.errmsg || e.error || e.error_message;
      res.status(e.http_code || 400).send({
        error: error_message
      });
    log(`Error has occurred in ${entity} ${action ? `while ${action}` : ''} `, e);
  }
}
