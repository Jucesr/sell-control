import fetch from 'cross-fetch'

export const addClient = (client) => {
  return dispatchAsyncAction(add_client, postClient, client);
}

export const updateClient = (client) => {
  return dispatchAsyncAction(update_client, patchClient, client);
}

export const removeClient = (_id) => {
  return dispatchAsyncAction(remove_client, deleteClient, _id);
}

//Async actions

export const fetchClients = () => {
  return (dispatch) => {
    dispatch(requestClients())

    return httpRequest('/api/clients')
      .then(
        json => dispatch(receiveClients(json)),
        error => console.log('An error occured.', error)
      )
  }
}

const postClient = (client) => {
  return httpRequest('/api/clients', 'POST', client);
}

const patchClient = (client) => {
  return httpRequest(`/api/clients/${client._id}`, 'PATCH', client);
}

const deleteClient = (_id) => {
  return httpRequest(`/api/clients/${_id}`, 'DELETE');
}

const httpRequest = (url, method, body = null) => {

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

const dispatchAsyncAction = (action, method, requestData) => {
  return (dispatch) => {

    return method(requestData)
      .then(
        data => dispatch(action(data))
      ).catch(
        e => {
           throw new Error(e);
        }
      )
  }
}


//Pure actions

const add_client = (client) => ({
  type: 'ADD_CLIENT',
  client
})

const update_client = (client) => ({
  type: 'UPDATE_CLIENT',
  client
})

const remove_client = ({_id}) => ({
  type: 'REMOVE_CLIENT',
  _id
})


const requestClients = () => ({
  type: 'REQUEST_CLIENTS'
})

const receiveClients = (clients) => ({
  type: 'RECEIVE_CLIENTS',
  clients
})
