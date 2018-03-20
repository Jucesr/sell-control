import './helpers/base'

import React from 'react';
import ReactDom from 'react-dom';

import ClientPage from './pages/ClientPage'

import './styles/master.scss'

const template = <p>My react template 2.0</p>;

ReactDom.render(<ClientPage/>, document.getElementById('app'));
