import './styles/master.scss'

import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import Header from './components/Header'
import Body from './components/Body'
import store from './store/store'

const App = () => (
  <Provider store={store}>
    <div>
      <Header/>
      <Body/>
    </div>

  </Provider>
)

ReactDom.render(<App/>, document.getElementById('app'))
