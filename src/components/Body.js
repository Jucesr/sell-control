import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ClientPage from '../pages/ClientPage'

import {SideBarContent} from './SideBar'

export const Body = ({sidebar_open}) => (
  <div className="Body">
    <SideBarContent
      open={sidebar_open}
    />
    <ClientPage/>
  </div>
)

const mapStateToProps = state => ({
  sidebar_open: state.ui.sidebar_open
})

export default connect(mapStateToProps)(Body)
