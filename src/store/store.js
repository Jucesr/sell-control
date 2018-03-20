import { createStore , combineReducers } from 'redux'
import clientReducer from '../reducers/clients'
 
const store = createStore(
  combineReducers({
    clients: clientReducer
  })
);

export default store;
