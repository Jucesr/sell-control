import React from 'react'
import PropTypes from 'prop-types'
import Sidebar from 'react-sideBar'
import { connect } from 'react-redux'

import ClientPage from '../pages/ClientPage'
import {SideBarContent} from './SideBar'

export const Body = ({sidebar_open}) => (
  <Sidebar sidebar={<SideBarContent/>}
           docked={sidebar_open}
           shadow={false}
           sidebarClassName="SideBar"
           >
           <ClientPage/>
  </Sidebar>
)

const mapStateToProps = state => ({
  sidebar_open: state.ui.sidebar_open
})

export default connect(mapStateToProps)(Body)
