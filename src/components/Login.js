import React from 'react'
import {Form, Field, Formik} from 'formik'
import Yup from 'yup'
import { connect } from 'react-redux'

import CustomForm from '../components/CustomForm'
import {signUp} from '../actions/auth'

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
    const require_message = 'This field is required';
    return (
      <div className="LoginPage">
          <div className="LoginPage_left">

          </div>
          <div className="LoginPage_right">
            {/* <h2 className="LoginPage_right_title">$ell Control</h2> */}
            <div className="LoginPage_layout">
              <div className="LoginPage_box">
                <div className="LoginPage_buttons">
                  <button className={this.state.login ? 'LoginPage_button_active': undefined} onClick={this.loginPage}>Log in</button>
                  <button className={!this.state.login ? 'LoginPage_button_active': undefined} onClick={this.signUpPage}>Sign up</button>
                </div>

                {this.state.login && <div className="LoginPage_login">
                  <h3 className="LoginPage_form_title">Log in to start using sell control!</h3>
                  <Formik
                    initialValues={{
                      username: '',
                      password: ''
                    }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string().required(require_message),
                      password: Yup.string().required(require_message)
                    })}
                    onSubmit={
                      (values, { resetForm, setErrors, setSubmitting, setValues}) => {
                        console.log(values);
                      }}
                    render={(props) => (
                      <Form className="LoginPage_login_form">
                        <Field
                          className="LoginPage_form_input"
                          name="username"
                          placeholder="Username"
                        />
                        {/* {props.message && <p>{props.message}</p>} */}
                        {props.touched.username && props.errors.username &&
                          <div className="LoginPage_form_error">{props.errors.username}</div>}
                        <Field
                          type="password"
                          className="LoginPage_form_input"
                          name="password"
                          placeholder="Password"
                        />
                        {props.touched.password && props.errors.password && <div className="LoginPage_form_error">{props.errors.password}</div>}
                        <p className="LoginPage_login_message" >
                          Don't you have an account? Go and sign up for <span onClick={this.signUpPage}>free</span>.
                        </p>
                        <button className="LoginPage_form_button">Log in</button>
                      </Form>
                    )}
                  />
                </div>}

                {!this.state.login && <div className="LoginPage_signup">
                  <h3 className="LoginPage_form_title">Sign up and take control. It's free!</h3>
                  <Formik
                    initialValues={{
                      username: '',
                      email: '',
                      password: ''
                    }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string().required(require_message),
                      password: Yup.string().required(require_message),
                      email: Yup.string().email('Email not valid').required(require_message)
                    })}
                    onSubmit={
                      (values, { resetForm, setErrors, setSubmitting, setValues}) => {
                        console.log(values);
                        this.props.signUp(values)
                      }}
                    render={(props) => (
                      <Form className="LoginPage_login_form">

                        <Field
                          className="LoginPage_form_input"
                          name="username"
                          placeholder="Username"
                        />
                        {props.touched && props.errors.username && <div className="LoginPage_form_error">{props.errors.username}</div>}

                        <Field
                          className="LoginPage_form_input"
                          name="email"
                          placeholder="Email"
                        />
                        {props.touched && props.errors.email && <div className="LoginPage_form_error">{props.errors.email}</div>}

                        <Field
                          type="password"
                          className="LoginPage_form_input"
                          name="password"
                          placeholder="Password"
                        />
                        {props.touched && props.errors.password && <div className="LoginPage_form_error">{props.errors.password}</div>}
                        <p className="LoginPage_login_message" >
                          Already have an account? Go and <span onClick={this.loginPage}>log in</span>.
                        </p>
                        <button className="LoginPage_form_button">Sign up</button>
                      </Form>
                    )}
                  />
                </div>}
              </div>

            </div>
          </div>
      </div>
    )
  };
}

const mapDispatchToProps = dispatch => ({
  signUp: user => dispatch(signUp(user))
})

export default connect(null, mapDispatchToProps)(LoginPage)
