import {dispatchAsyncAction} from './async'

// crud('create','client', client);

export const crud = (action, entity, dataToSend) => {
  let httpMethod, dispatchBeforeRequest;
  action = action.toUpperCase();

  const actionType = {
    type: `${action}_${entity.toUpperCase()}`
  } 

  let url = `/api/${entity.toLowerCase()}/`

  switch (action) {
    case 'CREATE':
      httpMethod = 'POST'
    break;
    case 'DELETE':
      httpMethod = 'DELETE'
      url += `${dataToSend['_id']}`
    break;
    case 'UPDATE':
      httpMethod = 'PATCH'
      url += `${dataToSend['_id']}`
    break;
    case 'READ':
      httpMethod = 'GET'
      url += `${dataToSend['_id']}`
    break;
    case
      'FETCH': httpMethod = 'GET'
      dispatchBeforeRequest = {
          type: `REQUEST_${entity.toUpperCase()}`
        }
    break;
  }
    return dispatchAsyncAction(actionType, httpMethod, url, dataToSend, dispatchBeforeRequest);
  }
