import {log} from './log'

export const error_handler = (e, res, entity, action) => {
  let error_message = e.message || e.errmsg || e.error || e.error_message;
    res.status(e.html_code || 400).send({
      error: error_message
    });
  log(`Error has occurred in ${entity} ${action ? `while ${action}` : ''} `, e);
}
