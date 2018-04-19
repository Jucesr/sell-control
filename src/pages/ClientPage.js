import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Yup from 'yup'

import Page from './Page'
import {addClient, fetchClients, updateClient, removeClient} from '../actions/clients'

const ClientPage = (props) => {

    const fields = {
      fist_name: {},
      last_name: {},
      address: {},
      email: {},
      phone: {
        type: 'phone'
      }
    }

    const require_message = 'This field is required';

    const fieldValidation = Yup.object().shape({
      fist_name: Yup.string().required(require_message),
      last_name: Yup.string(),
      address: Yup.string().max(40),
      email: Yup.string().email().required(require_message),
      phone: Yup.string().min(8)
    });

    const searchValidation = Yup.object().shape({
      email: Yup.string().email().required(require_message)
    });

    const columns = [
      {
        Header: 'Fist name',
        accessor: 'fist_name'
      },{
        Header: 'Last name',
        accessor: 'last_name'
      },{
        Header: 'Address',
        accessor: 'address'
      },{
        Header: 'Email',
        accessor: 'email'
      },{
        Header: 'Phone',
        accessor: 'phone'
      }
    ]



    return (
      <Page
        entity="client"
        entities={props.clients}
        isFetching={props.isFetching}
        sidebar_open={props.sidebar_open}
        fields={fields}
        fieldValidation={fieldValidation}
        searchField="email"
        searchValidation={searchValidation}
        fetchItems={props.fetchClients}
        addEntity={props.addClient}
        updateEntity={props.updateClient}
        removeEntity={props.removeClient}
        columns={columns}

      />
    )
  }


const mapStateToProps = state => ({
  clients: state.clients.items,
  isFetching: state.clients.isFetching,
  sidebar_open: state.ui.sidebar_open
})

const mapDispatchToProps = dispatch => ({
  addClient: client => dispatch(addClient(client)),
  updateClient: client => dispatch(updateClient(client)),
  removeClient: client => dispatch(removeClient(client)),
  fetchClients: () => dispatch(fetchClients())
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientPage)
