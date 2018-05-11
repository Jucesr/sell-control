import React from 'react'
import {Link } from "react-router-dom";
import { connect } from 'react-redux'
import {capitalizeFirstLetter} from '../helpers'
import {openModal, closeModal} from '../actions/ui'

class SideBar extends React.Component {

  constructor(props){
    const url = window.location.href;
    const active_module = url.substring(url.lastIndexOf('/') + 1)
    super(props);
    this.state = {
      active_module: active_module
    }
  }

  changeModule = (e) => {
    e.stopPropagation();

    if(this.props.disabled){
      this.props.openModal({
        category: 'info',
        title: 'Opps',
        message: 'Add or select a company to start working'
      })
    }else{
      let module = e.target.id;
      this.setState(() => ({
        active_module: module
      }))
    }


  }

  render(){
    const sidebar_class = `SideBar ${this.props.open ? 'SideBar_open' : 'SideBar_close'}`;

    return (
      <div className={sidebar_class}>
        <div className="SideBar__items">
          <SideBarItem
            name="company"
            onClick={this.changeModule}
            active={this.state.active_module}
          />
          <SideBarItem
            name="client"
            onClick={this.changeModule}
            active={this.state.active_module}
            disabled={this.props.disabled}
          />
          <SideBarItem
            name="supplier"
            onClick={this.changeModule}
            active={this.state.active_module}
            disabled={this.props.disabled}
          />
          <SideBarItem
            name="product"
            onClick={this.changeModule}
            active={this.state.active_module}
            disabled={this.props.disabled}
          />
          <SideBarItem
            name="sell"
            onClick={this.changeModule}
            active={this.state.active_module}
            disabled={this.props.disabled}
          />
          <SideBarItem
            name="settings"
            onClick={this.changeModule}
            active={this.state.active_module}
            disabled={this.props.disabled}
          />
      </div>
    </div>
    )
  };
}

const SideBarItem = ({name, onClick, active, disabled}) => {

  if(!disabled)
    return (
      <Link
        id={name}
        to={`/${name}`}
        className={`SideBar__item ${active == name ? 'SideBar__item_active' : ''}`}
        onClick={onClick}
      >
        <img id={name} src={`/img/${name}.png`}></img>
        <div id={name} className="SideBar__item__title" >{capitalizeFirstLetter(name)}</div>
      </Link>
    )

    return (
      <div
        id={name}
        className={`SideBar__item ${active == name ? 'SideBar__item_active' : ''}`}
        onClick={onClick}
      >
        <img id={name} src={`/img/${name}.png`}></img>
        <div id={name} className="SideBar__item__title" >{capitalizeFirstLetter(name)}</div>
      </div>
    )

}



const mapStateToProps = state => ({
  open: state.ui.sidebar_open,
  disabled: true
})

const mapDispatchToProps = dispatch => ({
  openModal: data => dispatch(openModal(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
