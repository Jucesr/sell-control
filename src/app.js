import './styles/master.scss'

import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import store from './store/store'

import AppRouter from './routers/AppRouter'
import {logIn} from './actions/auth'

let user = localStorage.getItem('user');

if(user){
  store.dispatch(logIn(JSON.parse(user)))
}

const App = () => (
  <Provider store={store}>
    <AppRouter/>
  </Provider>
)

ReactDom.render(<App/>, document.getElementById('app'))
