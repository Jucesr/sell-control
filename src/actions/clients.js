import fetch from 'cross-fetch'

export const addClient = (client) => ({
  type: 'ADD_CLIENT',
  client: {
    ...client
  }
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

export const fetchClients = () => {
  return (dispatch) => {
    dispatch(requestClients())

    return fetch('/api/clients')
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
        .then(
          json => dispatch(receiveClients(json)),
          error => console.log('An error occured.', error)
        )
  }
}
