import React from 'react'
import Form from '../components/CustomForm'

class LoginPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      login: true
    }
  }

  render(){

    return (
      <div className="LoginPage">
        <div className="LoginPage_wrapper">
          <div className="LoginPage_box">
            <div className="LoginPage_buttons">
              <button>Log in</button>
              <button>Sign up</button>
            </div>

            <div className="LoginPage_login">
              <Form
                fields={{
                  username: {},
                  password: {}
                }}
                onSubmit={d => console.log(d)}
              />
            </div>

            <div className="LoginPage_signup">

            </div>
          </div>
        </div>
      </div>
    )
  };
}

export default LoginPage
