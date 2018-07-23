import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Yup from 'yup'

import Page from './Page'
import {addSupplier, fetchSuppliers, updateSupplier, removeSupplier} from '../actions/suppliers'

const SupplierPage = (props) => {

    const fields = {
      name: {},
      contact_name: {},
      address: {},
      email: {},
      phone: {
        type: 'phone'
      }
    }

    const require_message = 'This field is required';

    const fieldValidation = Yup.object().shape({
      name: Yup.string().required(require_message),
      contact_name: Yup.string(),
      address: Yup.string().max(40),
      email: Yup.string().email().required(require_message),
      phone: Yup.string().min(8)
    });

    const searchValidation = Yup.object().shape({
      email: Yup.string().email().required(require_message)
    })

    const columns = [
      {
        Header: 'Name',
        accessor: 'name'
      },{
        Header: 'Contact name',
        accessor: 'contact_name'
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
        entity="supplier"
        entities={props.suppliers}
        isFetching={props.isFetching}
        fields={fields}
        fieldValidation={fieldValidation}
        searchField="email"
        searchValidation={searchValidation}
        fetchItems={props.fetchSuppliers}
        addEntity={props.addSupplier}
        updateEntity={props.updateSupplier}
        removeEntity={props.removeSupplier}
        columns={columns}

      />
    )
  }


const mapStateToProps = state => ({
  suppliers: state.suppliers.items,
  isFetching: state.suppliers.isFetching,
})

const mapDispatchToProps = dispatch => ({
  addSupplier: supplier => dispatch(addSupplier(supplier)),
  updateSupplier: supplier => dispatch(updateSupplier(supplier)),
  removeSupplier: supplier => dispatch(removeSupplier(supplier)),
  fetchSuppliers: () => dispatch(fetchSuppliers()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SupplierPage)
