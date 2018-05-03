import React from 'react'
import Form from '../components/CustomForm'

class LoginPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      login: true
    }
  }

  loginPage = () => {
    this.setState((prevState) => ({
      login: true
    }))
  }

  signUpPage = () => {
    this.setState((prevState) => ({
      login: false
    }))
  }

  render(){

    return (
      <div className="LoginPage">
        <div className="LoginPage_wrapper">
          <div className="LoginPage_box">
            <div className="LoginPage_buttons">
              <button onClick={this.loginPage}>Log in</button>
              <button onClick={this.signUpPage}>Sign up</button>
            </div>

            {this.state.login && <div className="LoginPage_login">
              <Form
                fields={{
                  username: {},
                  password: {}
                }}
                cancelButton={false}
                textSubmitButton={'Log in'}
                onSubmit={d => console.log(d)}
              />
            </div>}

            {!this.state.login && <div className="LoginPage_signup">
              <Form
                fields={{
                  username: {},
                  email: {},
                  password: {}
                }}
                textSubmitButton={'Sign up'}
                cancelButton={false}
                onSubmit={d => console.log(d)}
              />
            </div>}
          </div>
        </div>
      </div>
    )
  };
}

export default LoginPage
