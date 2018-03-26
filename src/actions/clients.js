import fetch from 'cross-fetch'

export const addClient = (client) => {
  return (dispatch) => {

    return postClient(client)
      .then(
        data => dispatch(add_client(data))
      ).catch(
        e => console.log('Error occured while adding client')
      )
  }
}

const add_client = (client) => ({
  type: 'ADD_CLIENT',
  client
})

export const deleteClient = (id) => ({
  type: 'DELETE_CLIENT',
  id
})

const requestClients = () => ({
  type: 'REQUEST_CLIENTS'
})

const receiveClients = (clients) => ({
  type: 'RECEIVE_CLIENTS',
  clients
})

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
  return httpRequest('/api/clients', {
    body: JSON.stringify(client), // must match 'Content-Type' header
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
  });
}

const patchClient = (client) => {
  return httpRequest(`/api/clients/${client._id}`, {
    body: JSON.stringify(client), // must match 'Content-Type' header
    headers: {
      'content-type': 'application/json'
    },
    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
  });
}

const httpRequest = (url, data = null) => {
  return fetch(url, data)
    .then(response => response.json())
}
