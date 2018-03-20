export const addClient = (client) => ({
  type: 'ADD_CLIENT',
  client: {
    ...client
  }
});

export const deleteClient = (id) => ({
  type: 'DELETE_CLIENT',
  id
})
