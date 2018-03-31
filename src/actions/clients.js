import {crud} from './crud'

const entity = 'client'

export const addClient = (client) => {
  return crud('CREATE', entity, client);
}

export const updateClient = (client) => {
  return crud('UPDATE', entity, client);
}

export const removeClient = (client) => {
  return crud('DELETE', entity, client);
}

export const fetchClients = () => {
  return crud('FETCH', entity);
}
