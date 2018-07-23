import {crud} from './crud'

const entity = 'product'

export const addProduct = (client) => {
  return crud('CREATE', entity, client);
}

export const updateProduct = (client) => {
  return crud('UPDATE', entity, client);
}

export const removeProduct = (client) => {
  return crud('DELETE', entity, client);
}

export const fetchProducts = () => {
  return crud('FETCH', entity);
}
