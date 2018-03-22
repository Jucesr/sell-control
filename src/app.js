import './helpers/base'
import './styles/master.scss'

import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import ClientPage from './pages/ClientPage'
import store from './store/store'

const template = <p>My react template 2.0</p>

const App = () => (
  <Provider store={store}>
    <ClientPage />
  </Provider>
)

ReactDom.render(<App/>, document.getElementById('app'))
