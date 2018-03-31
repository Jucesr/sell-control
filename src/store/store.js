import { createStore , combineReducers, applyMiddleware  } from 'redux'
import thunkMiddleware from 'redux-thunk'
import clientReducer from '../reducers/clients'
import uiReducer from '../reducers/ui'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
 
const store = createStore(
  combineReducers({
    clients: clientReducer(),
    ui: uiReducer
  }),
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

export default store
