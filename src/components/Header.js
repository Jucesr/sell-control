import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {toggleSidebar} from '../actions/ui'

const Header = ({toggleSidebar, username}) => (
  <header className="Header">
    <div className="Header__left">
      <div
        className="Header__menu"
        onClick={toggleSidebar}
        >
        <img width="30px" src="/img/menu.png"></img>
      </div>
      <div className="Header__title">
        <h1>Sell Control</h1>
      </div>
    </div>
    <div className="Header__right">
      <div className="Header__username">{username}</div>
      <div
        className="Header__avatar"
        >
        <img src="https://lh6.googleusercontent.com/-2fjOKIUHjII/AAAAAAAAAAI/AAAAAAAAABA/e3l9hFs0Bvs/photo.jpg?sz=30"></img>
      </div>

    </div>
  </header>
)

const mapDispatchToProps = dispatch => ({
  toggleSidebar: () => dispatch(toggleSidebar())
})

const mapStateToProps = state => ({
  username: state.auth.username
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
