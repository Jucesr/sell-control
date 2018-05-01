import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Yup from 'yup'

import Page from './Page'
import {addProduct, fetchProducts, updateProduct, removeProduct} from '../actions/products'
import {fetchSuppliers} from '../actions/suppliers'

class ProductPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
        supplier_id: {
          type: 'combo',
          label: 'Supplier',
          combo_data: []
        },
        code: {
          label: 'Product code'
        },
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
  }

  componentDidMount(){
    this.props.fetchSuppliers().then(
      () => this.setState((prevState) => ({
          ...prevState.fields,
          supplier_id:{
            ...prevState.supplier_id,
            combo_data: getSuppliers(this.props.suppliers)
          }
      }))
    )
  }

  render(){


    const require_message = 'This field is required';

    const fieldValidation = Yup.object().shape({
      supplier_id: Yup.string().required(require_message),
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
        entities={this.props.products}
        isFetching={this.props.isFetching}
        fields={this.state}
        fieldValidation={fieldValidation}
        searchField="code"
        searchValidation={searchValidation}
        fetchItems={this.props.fetchProducts}
        addEntity={this.props.addProduct}
        // addEntity={product => console.log(product)}
        updateEntity={this.props.updateProduct}
        removeEntity={this.props.removeProduct}
        columns={columns}

      />
    )
  };
}

// export default ProductPage;


const getSuppliers = suppliers => suppliers.map( supplier => ({
  value: supplier._id,
  label: supplier.name
}))

const mapStateToProps = state => ({
  products: state.products.items,
  suppliers: state.suppliers.items,
  isFetching: state.products.isFetching,
})

const mapDispatchToProps = dispatch => ({
  addProduct: product => dispatch(addProduct(product)),
  updateProduct: product => dispatch(updateProduct(product)),
  removeProduct: product => dispatch(removeProduct(product)),
  fetchProducts: () => dispatch(fetchProducts()),
  fetchSuppliers: () => dispatch(fetchSuppliers())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
