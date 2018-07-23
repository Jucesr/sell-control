import { createStore , combineReducers, applyMiddleware  } from 'redux'
import thunkMiddleware from 'redux-thunk'
import crudReducer from '../reducers/crud'
import uiReducer from '../reducers/ui'
import authReducer from '../reducers/auth'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
 
const store = createStore(
  combineReducers({
    clients: crudReducer('client'),
    suppliers: crudReducer('supplier'),
    products: crudReducer('product'),
    ui: uiReducer,
    auth: authReducer
  }),
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

export default store
