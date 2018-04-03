import {crud} from './crud'

const entity = 'supplier'

export const addSupplier = (client) => {
  return crud('CREATE', entity, client);
}

export const updateSupplier = (client) => {
  return crud('UPDATE', entity, client);
}

export const removeSupplier = (client) => {
  return crud('DELETE', entity, client);
}

export const fetchSuppliers = () => {
  return crud('FETCH', entity);
}
