import './styles/master.scss'

import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import ClientPage from './pages/ClientPage'
import {Header} from './components/Header'
import {SideBar} from './components/SideBar'
import store from './store/store'

const App = () => (
  <Provider store={store}>
    <div>
      <Header/>
      <div className="Body">
        <SideBar/>
        <ClientPage />
      </div>

    </div>

  </Provider>
)

ReactDom.render(<App/>, document.getElementById('app'))
