import { createStore , combineReducers, applyMiddleware  } from 'redux'
import thunkMiddleware from 'redux-thunk'
import crudReducer from '../reducers/crud'
import uiReducer from '../reducers/ui'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
 
const store = createStore(
  combineReducers({
    clients: crudReducer('client'),
    suppliers: crudReducer('supplier'),
    ui: uiReducer
  }),
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

export default store
