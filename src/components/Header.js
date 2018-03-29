import React from 'react'
import PropTypes from 'prop-types'

export const Header = () => (
  <header className="Header">
    <div className="Header__left">
      <div className="Header__menu">
        <img width="30px" src="/img/menu.png"></img>
      </div>
      <div className="Header__title">
        <h1>Sell Control</h1>
      </div>
    </div>
    <div className="Header__right">
      <div className="Header__username">Jucesr</div>
      <div className="Header__image">
        <img src="https://lh6.googleusercontent.com/-2fjOKIUHjII/AAAAAAAAAAI/AAAAAAAAABA/e3l9hFs0Bvs/photo.jpg?sz=30"></img>
      </div>

    </div>
  </header>
)
