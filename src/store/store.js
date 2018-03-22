import { createStore , combineReducers, applyMiddleware  } from 'redux'
import thunkMiddleware from 'redux-thunk'
import clientReducer from '../reducers/clients'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
 
const store = createStore(
  combineReducers({
    clients: clientReducer
  }),
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

export default store
