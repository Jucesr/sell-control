import React from 'react'
import {Link } from "react-router-dom";
import { connect } from 'react-redux'

const SideBar = ({open}) => {
  const items_class = `SideBar__item__title `;//${open ? 'SideBar__item__title_show' : 'SideBar__item__title_hide'}`;
  const sidebar_class = `SideBar ${open ? 'SideBar_open' : 'SideBar_close'}`;
  return (
    <div className={sidebar_class}>
      <div className="SideBar__items">
        <Link to="/client" >
          <div className="SideBar__item">
            <img src="/img/client.png"></img>
            <div className={items_class}>Clients</div>
          </div>
        </Link>
        <div className="SideBar__item">
          <img src="/img/supplier.png"></img>
          <div className={items_class}>Suppliers</div>
        </div>
        <div className="SideBar__item">
          <img src="/img/product.png"></img>
          <div className={items_class}>Products</div>
        </div>
        <div className="SideBar__item">
          <img src="/img/sell.png"></img>
          <div className={items_class}>Sells</div>
        </div>
        <div className="SideBar__item">
          <img src="/img/settings.png"></img>
          <div className={items_class}>Settings</div>
        </div>
    </div>
  </div>
  )
}


const mapStateToProps = state => ({
  open: state.ui.sidebar_open
})

export default connect(mapStateToProps)(SideBar)
