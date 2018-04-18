import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Header from '../components/Header'
import SideBar from '../components/SideBar'
import ClientPage from '../pages/ClientPage'
import SupplierPage from '../pages/SupplierPage'
import ProductPage from '../pages/ProductPage'


const AppRouter = () => (
  <BrowserRouter >
    <div>
      <Header/>
      <SideBar/>
      <Switch>
        <Route path="/" component={() => <div style={{padding: '10rem'}}>None</div>} exact={true} />
        <Route path="/client" component={ClientPage} />
        <Route path="/supplier" component={SupplierPage} />
        <Route path="/product" component={ProductPage} />
        {/* <Route component={NotFoundPage} /> */}
      </Switch>
    </div>
  </BrowserRouter>
)

export default AppRouter;
