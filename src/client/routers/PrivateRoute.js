import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import Header from '../components/Header'
import SideBar from '../components/SideBar'

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => (
      isAuthenticated ? (
        <div >
          <Header/>
          <SideBar/>
          <Component {...props} />
        </div>
      ) : (
          <Redirect to="/login" />
        )
    )} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth._id
});

export default connect(mapStateToProps)(PrivateRoute);
