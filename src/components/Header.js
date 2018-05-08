import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {toggleSidebar} from '../actions/ui'

class Header extends React.Component {

  constructor(props){
    super(props);
    this.dropDownMenuElement = null;
    this.headerLoginElement = null;
    this.state = {
      dropDowwLeft: null,
      dropDownOpen: true
    }
  }

  openMenu = (e) =>{
    this.setState((prevState) => ({
      dropDownOpen: !prevState.dropDownOpen
    }))
  }

  componentDidMount(){
    let header_width = this.headerLoginElement.offsetWidth;
    let drop_down_width = this.dropDownMenuElement.offsetWidth;

    console.log(header_width, drop_down_width);
    let offsetLeft = (drop_down_width - header_width + 1) * -1;

    this.setState((prevState) => ({
      dropDowwLeft: offsetLeft,
      dropDownOpen: false,
    }))
  }

  setDropDownMenuElement = element => {
      this.dropDownMenuElement = element;
  };

  setHeaderLoginElement = element => {
      this.headerLoginElement = element;
  };

  render(){
    const {toggleSidebar, username, email} = this.props;
    return (
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
        <div
          className="Header__right"
          ref={this.setHeaderLoginElement}
          >
          <div className="Header__username">{username}</div>
          <div className="Header__avatar">
            {/* <img src="https://lh6.googleusercontent.com/-2fjOKIUHjII/AAAAAAAAAAI/AAAAAAAAABA/e3l9hFs0Bvs/photo.jpg?sz=30"></img> */}
            <img width="26px" src={`/img/user.png`}></img>
          </div>
          <div className="Header__arrow" onClick={this.openMenu}>
            <img width="12px" src={`/img/${this.state.dropDownOpen ? 'up': 'down'}_arrow.png`}></img>
          </div>

          <div
            className="Header__dropdown"
            style={{
              left: `${this.state.dropDowwLeft}px`,
              display: `${this.state.dropDownOpen ? 'block': 'none'}`
            }}
            ref={this.setDropDownMenuElement}
          >
            <p>{email}</p>
            <button>Sign out</button>
          </div>

        </div>
      </header>
    )
  };
}

const mapDispatchToProps = dispatch => ({
  toggleSidebar: () => dispatch(toggleSidebar())
})

const mapStateToProps = state => ({
  username: state.auth.username,
  email: state.auth.email
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
