import fetch from 'cross-fetch'

export const httpRequest = (url, method, body = null) => {

  let requestObj = {
    headers: {
      'content-type': 'application/json'
    },
    method: method // *GET, POST, PUT, DELETE, etc.
  }

  if(body){
    requestObj.body = JSON.stringify(body);
  }

  return fetch(url, requestObj)
    .then(response => response.json())
}

// export const dispatchAsyncAction = (action, method, requestData) => {
//   return (dispatch) => {
//
//     return method(requestData)
//       .then(
//         data => dispatch(action(data))
//       ).catch(
//         e => {
//            throw new Error(e);
//         }
//       )
//   }
// }

export const dispatchAsyncAction = (actionType, httpMethod, url, dataToSend, dispatchBeforeRequest) => {

  return (dispatch) => {
    if(!!dispatchBeforeRequest){
      dispatch(dispatchBeforeRequest)
    }
    return httpRequest(url, httpMethod, dataToSend)
      .then(
        data => dispatch({
          ...actionType,
          entity: data
        })
      ).catch(
        e => {
           throw new Error(e);
        }
      )
  }
}
