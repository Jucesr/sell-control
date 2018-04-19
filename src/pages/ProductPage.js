import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Yup from 'yup'

import {arrayToObject, assignValueToFields} from '../helpers'
import {NewPage} from '../components/NewPage'
import {ListPage} from '../components/ListPage'
import {EditPage} from '../components/EditPage'

import {addProduct, fetchProducts, updateProduct, removeProduct} from '../actions/products'
import {openModal} from '../actions/ui'

class ProductPage extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      active_page: 'new',
      fields: {
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
    }
  }

  componentDidMount() {
    this.props.fetchProducts();
  }

  changePage = (e) => {
    let page = e.target.id
    this.setState(() => ({
      active_page: page
    }))
  }

  onSearch = ({code}, resetForm, setErrors) => {

    this.props.showMessage({
      category: 'async',
      title: `Searching product...`
    })

    const product = this.props.products.filter(product => product.code == code)[0];

    if(product){

      this.setState((prevState) => ({
          fields: {
            ...assignValueToFields(prevState.fields, product),
            _id: {
              value: product._id,
              render: false
            }
          }
      }))

    }else{
      //TODO: Search in Database.
      this.props.showMessage({
        category: 'error',
        title: `Product was not found`
      })
      setErrors({code: 'Product was not found'})
    }



  }

  onAdd = (product, resetForm, setErrors) => {

    this.props.showMessage({
      category: 'async',
      title: 'Adding product...'
    })

    const search = this.props.products.filter((item) => item.code == product.code)
    if(search.length == 0){
      this.props.addProduct(product).then(
        (message) => {
          if(message.error){
            this.props.showMessage({
              category: 'error',
              title: `Product could not be added`,
              message: message.error
            })

          }else{
            this.props.showMessage({
              category: 'success',
              title: 'Product added'
            })
          }

        }
      ).then(resetForm)
    }else{
      this.props.showMessage({
        category: 'error',
        title: `Opps`,
        message: 'The code is alredy used in another product'
      })
      setErrors({code: 'The code is alredy used in another product'})
    }

  }

  onDelete = (product) => {

    product = {
      ...product,
      _id: this.state.fields._id.value
    }

    this.props.removeProduct(product).then(
      () => {
        this.props.showMessage({
          category: 'success',
          title: 'Product deleted'
        })
      },
      e => {
        this.props.showMessage({
          category: 'error',
          title: 'Opps',
          message: e
        })
      }
    ).then(() => this.onCancelEdit());

  }

  onEdit = (updatedProduct, resetForm, setErrors) => {

    updatedProduct = {
      ...updatedProduct,
      _id: this.state.fields._id.value
    }

    const search = this.props.products.filter((item) => (item.code == updatedProduct.code && item._id != updatedProduct._id));

    if(search.length == 0){
      this.props.updateProduct(updatedProduct).then(
        (message) => {
          this.props.showMessage({
            category: 'success',
            title: 'Product saved'
          })
          this.onCancelEdit();
        },
        e => alert(e)
      )
    }else{
      this.props.showMessage({
        category: 'error',
        title: `Opps`,
        message: 'The code is alredy used in another product'
      })
      setErrors({code: 'The code is alredy taken'})
    }
  }

  onCancelEdit = () => {
    let newFields = assignValueToFields(this.state.fields);
    delete newFields._id
    this.setState((prevState) => ({
        fields: newFields
    }));
  }

  onClickItemTable = (product) => {

    this.setState((prevState) => ({
        fields: {
          ...assignValueToFields(prevState.fields, product),
          _id: {
            value: product._id,
            render: false
          }
        },
        active_page: 'edit'
    }))
  }

  render(){

    const require_message = 'This field is required';
    const {productToEdit} = this.state;

    return (
      <div className ={`Page ${this.props.sidebar_open ? 'Page__open': 'Page__closed'}`}>
        <div className= 'Page__title'><h2> Products </h2></div>

        <div className="Page__actions">
          <button className={this.state.active_page == 'list' ? 'Page__button_page_active' : 'Page__button_page'} id="list" onClick={this.changePage}>List</button>
          <button className={this.state.active_page == 'new' ? 'Page__button_page_active' : 'Page__button_page'} id="new" onClick={this.changePage}>New</button>
          <button className={this.state.active_page == 'edit' ? 'Page__button_page_active' : 'Page__button_page'} id="edit" onClick={this.changePage}>Edit</button>
        </div>

        <div className="Page__content_wrapper">
          <div className="Page__content">
            { this.state.active_page == 'list' &&
              <ListPage
                columns={[
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
                ]}
                items={this.props.products}
                loading={this.props.isFetching}
                onClickItemTable={this.onClickItemTable}
              />
            }

            { this.state.active_page == 'new' &&
              <NewPage
                formFields={this.state.fields}
                onAdd={this.onAdd}
                validationSchema={Yup.object().shape({
                  code: Yup.string().required(require_message),
                  name: Yup.string().required(require_message),
                  description: Yup.string(),
                  uom: Yup.string(),
                  cost: Yup.number().moreThan(0, `It can't be a negative number`).required(require_message),
                  price: Yup.number().moreThan(Yup.ref('cost'), `It can't be a less than cost`).required(require_message),
                  inventory: Yup.boolean(),
                  how_many: Yup.number().moreThan(0, `It can't be a negative number`)
                })}
              />
            }

            { this.state.active_page == 'edit' &&
              <EditPage
                editForm={{
                  fields: this.state.fields,
                  validationSchema: Yup.object().shape({
                    code: Yup.string().required(require_message),
                    name: Yup.string().required(require_message),
                    description: Yup.string(),
                    uom: Yup.string(),
                    cost: Yup.number().moreThan(0, `It can't be a negative number`),
                    price: Yup.number().moreThan(Yup.ref('cost'), `It can't be a less than cost`),
                    inventory: Yup.boolean(),
                    how_many: Yup.number().moreThan(0, `It can't be a negative number`)
                  })
                }}
                searchForm={{
                  fields: {
                    code: {}
                  },
                  validationSchema: Yup.object().shape({
                    code: Yup.string().required(require_message)
                  })
                }}
                onSave={this.onEdit}
                onDelete={this.onDelete}
                onCancel={this.onCancelEdit}
                onSearch={this.onSearch}
                disabledForm={this.state.fields.hasOwnProperty('_id')}
              />
            }

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  products: state.products.items,
  isFetching: state.products.isFetching,
  sidebar_open: state.ui.sidebar_open
})

const mapDispatchToProps = dispatch => ({
  addProduct: product => dispatch(addProduct(product)),
  updateProduct: product => dispatch(updateProduct(product)),
  removeProduct: product => dispatch(removeProduct(product)),
  fetchProducts: () => dispatch(fetchProducts()),
  showMessage: (data) => dispatch(openModal(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
