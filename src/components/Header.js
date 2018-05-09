import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {toggleSidebar} from '../actions/ui'
import {logOut} from '../actions/auth'

class Header extends React.Component {

  constructor(props){
    super(props);
    this.dropDownMenuElement = null;
    this.headerLoginElement = null;
    this.state = {
      dropDowwLeft: 500,
      dropDownOpen: true
    }
  }

  openMenu = (e) =>{

    if(!this.state.dropDownOpen){
      this.setState((prevState) => ({
        dropDownOpen: true
      }), () => {
        this.dropDownMenuElement.focus();
      })
    }
  }

  logOut = () => {
    this.props.logOut();
    localStorage.removeItem('user');
  }

  componentDidMount(){

    //The dropdown has not been complete render at this time, it needs a small delay to get real offsetWidth
    //More info: https://github.com/facebook/react/issues/5979
    setTimeout(() => {
        let header_width = this.headerLoginElement.offsetWidth;
        let drop_down_width = this.dropDownMenuElement.offsetWidth;

        let offsetLeft = (drop_down_width - header_width + 1) * -1;

        this.setState((prevState) => ({
          dropDowwLeft: offsetLeft,
          dropDownOpen: false,
        }))
    },100)


  }

  setDropDownMenuElement = element => {
      this.dropDownMenuElement = element;
  };

  setHeaderLoginElement = element => {
      this.headerLoginElement = element;
  };

  onBlur = e => {
    setTimeout(() => {
      this.setState((prevState) => ({
        dropDownOpen: false
      }))
    },200)

  }

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
          <div className="Header__arrow" >
            {this.state.dropDownOpen ?
              <img width="12px" src={`/img/up_arrow.png`}></img> :
              <img onClick={this.openMenu} width="12px" src={`/img/down_arrow.png`}></img>
            }

          </div>

          <div
            className="Header__dropdown"
            style={{
              left: `${this.state.dropDowwLeft}px`,
              display: `${this.state.dropDownOpen ? 'flex': 'none'}`
            }}
            ref={this.setDropDownMenuElement}
            onBlur={this.onBlur}
            tabIndex="1"
          >
            <div className="Header__account_info">
              <img width="32px" src={`/img/user.png`}></img>
              <p className="Header__account_info_username">{username}</p>
              <p className="Header__account_info_email">{email}</p>
            </div>
            {/* <span className="Header__role">Administrator</span> */}
            <span className="Header__log_out" onClick={this.logOut}>Sign out</span>
          </div>

        </div>
      </header>
    )
  };
}

const mapDispatchToProps = dispatch => ({
  toggleSidebar: () => dispatch(toggleSidebar()),
  logOut : () => dispatch(logOut())
})

const mapStateToProps = state => ({
  username: state.auth.username,
  email: state.auth.email
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
