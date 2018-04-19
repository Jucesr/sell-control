import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Yup from 'yup'

import Page from './Page'
import {addProduct, fetchProducts, updateProduct, removeProduct} from '../actions/products'

const ProductPage = (props) => {

    const fields = {
      code: {},
      name: {},
      description: {},
      uom: {},
      cost: {
        type: 'currency'
      },
      price: {
        type: 'currency'
      },
      how_many: {
        type: 'number',
        label: 'Stock',
        message: `Leave it empty if you don't want to handle inventory`
      }
    }

    const require_message = 'This field is required';

    const fieldValidation = Yup.object().shape({
      code: Yup.string().required(require_message),
      name: Yup.string().required(require_message),
      description: Yup.string(),
      uom: Yup.string(),
      cost: Yup.number().moreThan(0, `It can't be a negative number`).required(require_message),
      price: Yup.number().moreThan(Yup.ref('cost'), `It can't be a less than cost`).required(require_message),
      inventory: Yup.boolean(),
      how_many: Yup.number().moreThan(0, `It can't be a negative number`)
    })

    const searchValidation = Yup.object().shape({
      code: Yup.string().required(require_message)
    })

    const columns = [
      {
        Header: 'Code',
        accessor: 'code'
      },{
        Header: 'Name',
        accessor: 'name'
      },{
        Header: 'Description',
        accessor: 'description'
      },{
        Header: 'UOM',
        accessor: 'uom'
      },{
        Header: 'Cost',
        accessor: 'cost'
      },{
        Header: 'Price',
        accessor: 'price'
      },{
        Header: 'Inventory',
        accessor: 'inventory'
      },{
        Header: 'Stock',
        accessor: 'how_many'
      }
    ]

    return (
      <Page
        entity="product"
        entities={props.products}
        isFetching={props.isFetching}
        fields={fields}
        fieldValidation={fieldValidation}
        searchField="code"
        searchValidation={searchValidation}
        fetchItems={props.fetchProducts}
        addEntity={props.addProduct}
        updateEntity={props.updateProduct}
        removeEntity={props.removeProduct}
        columns={columns}

      />
    )
  }


const mapStateToProps = state => ({
  products: state.products.items,
  isFetching: state.products.isFetching,
})

const mapDispatchToProps = dispatch => ({
  addProduct: product => dispatch(addProduct(product)),
  updateProduct: product => dispatch(updateProduct(product)),
  removeProduct: product => dispatch(removeProduct(product)),
  fetchProducts: () => dispatch(fetchProducts()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
