import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'

import Header from '../components/Header'
import LoginPage from '../components/Login'
import SideBar from '../components/SideBar'
import ClientPage from '../pages/ClientPage'
import SupplierPage from '../pages/SupplierPage'
import ProductPage from '../pages/ProductPage'
import Modal from '../components/Modal'


const AppRouter = () => (
  <BrowserRouter >
    <div>
      <Switch>
        <PrivateRoute path="/" component={() => <div style={{padding: '10rem'}}>None</div>} exact={true} />
        <PrivateRoute path="/client" component={ClientPage} />
        <PrivateRoute path="/supplier" component={SupplierPage} />
        <PrivateRoute path="/product" component={ProductPage} />
        <PublicRoute path="/login" component={LoginPage} />
        <Redirect to="/login" />
        {/* <Route component={NotFoundPage} /> */}
      </Switch>
      <Modal/>
    </div>
  </BrowserRouter>
)

export default AppRouter;
