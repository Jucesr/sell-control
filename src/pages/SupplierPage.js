import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Yup from 'yup'

import {arrayToObject} from '../helpers'
import {NewPage} from '../components/NewPage'
import {ListPage} from '../components/ListPage'
import {EditPage} from '../components/EditPage'
import {addSupplier, fetchSuppliers, updateSupplier, removeSupplier} from '../actions/suppliers'

class SupplierPage extends React.Component{

  constructor(props){
    super(props)

    this.fields = ['name', 'contact_name', 'address', 'email', 'phone'];

    this.state = {
      active_page: 'new',
      supplierToEdit: arrayToObject(this.fields)
    }
  }

  componentDidMount() {
    this.props.fetchSuppliers();
  }

  changePage = (e) => {
    let page = e.target.id
    this.setState(() => ({
      active_page: page
    }))
  }

  onSearch = ({email}, resetForm, setErrors) => {
    const supplier = this.props.suppliers.filter(supplier => supplier.email == email)[0];

    if(supplier){
      this.setState(() => ({
          supplierToEdit: supplier
      }))
    }else{
      //TODO: Search in Database.
      setErrors({email: 'Supplier was not found'})
    }

  }

  onAdd = (supplier, resetForm, setErrors) => {
    const search = this.props.suppliers.filter((item) => item.email == supplier.email)
    if(search.length == 0){
      this.props.addSupplier(supplier).then(
        () => {
          alert('Supplier added')
        }
      ).catch(
        e => alert(e)
      ).then(resetForm)
    }else{
      setErrors({email: 'The email is alredy taken'})
    }

  }

  onDelete = (supplier) => {

    supplier = {
      ...supplier,
      _id: this.state.supplierToEdit._id
    }

    this.props.removeSupplier(supplier).then(
      () => alert('Supplier deleted'),
      e => alert(e)
    ).then(() => this.onCancelEdit());

  }

  onEdit = (updatedSupplier, resetForm, setErrors) => {

    updatedSupplier = {
      ...updatedSupplier,
      _id: this.state.supplierToEdit._id
    }

    const search = this.props.suppliers.filter((item) => (item.email == updatedSupplier.email && item._id != updatedSupplier._id));

    if(search.length == 0){
      this.props.updateSupplier(updatedSupplier).then(
        () => {
          alert('Supplier saved');
          this.onCancelEdit();
        },
        e => alert(e)
      )
    }else{
      setErrors({email: 'The email is alredy taken'})
    }
  }

  onCancelEdit = () => {
    this.setState(() => ({
        supplierToEdit: {
          name: '',
          contact_name: '',
          address: '',
          email: '',
          phone: ''
        }
    }));
  }

  onClickItemTable = (supplier) => {
    this.setState(() => ({
        supplierToEdit: supplier,
        active_page: 'edit'
    }))
  }

  render(){

    const require_message = 'This field is required';
    const {supplierToEdit} = this.state;

    return (
      <div className ={`Page ${this.props.sidebar_open ? 'Page__open': 'Page__closed'}`}>
        <div className= 'Page__title'><h2> Suppliers </h2></div>

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
                ]}
                items={this.props.suppliers}
                loading={this.props.isFetching}
                onClickItemTable={this.onClickItemTable}
              />
            }

            { this.state.active_page == 'new' &&
              <NewPage
                formFields={arrayToObject(this.fields)}
                onAdd={this.onAdd}
                validationSchema={Yup.object().shape({
                  name: Yup.string().required(require_message),
                  contact_name: Yup.string(),
                  address: Yup.string().max(40),
                  email: Yup.string().email().required(require_message),
                  phone: Yup.string().min(8)
                })}
              />
            }

            { this.state.active_page == 'edit' &&
              <EditPage
                editForm={{
                  fields: arrayToObject(this.fields, supplierToEdit),
                  validationSchema: Yup.object().shape({
                    name: Yup.string().required(require_message),
                    contact_name: Yup.string(),
                    address: Yup.string().max(40),
                    email: Yup.string().email().required(require_message),
                    phone: Yup.string().min(8)
                  })
                }}
                searchForm={{
                  fields: {
                    email: ''
                  },
                  validationSchema: Yup.object().shape({
                    email: Yup.string().email().required(require_message)
                  })
                }}
                onSave={this.onEdit}
                onDelete={this.onDelete}
                onCancel={this.onCancelEdit}
                onSearch={this.onSearch}
                disabledForm={supplierToEdit.hasOwnProperty('_id')}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  suppliers: state.suppliers.items,
  isFetching: state.suppliers.isFetching,
  sidebar_open: state.ui.sidebar_open
})

const mapDispatchToProps = dispatch => ({
  addSupplier: supplier => dispatch(addSupplier(supplier)),
  updateSupplier: supplier => dispatch(updateSupplier(supplier)),
  removeSupplier: supplier => dispatch(removeSupplier(supplier)),
  fetchSuppliers: () => dispatch(fetchSuppliers())
})

export default connect(mapStateToProps, mapDispatchToProps)(SupplierPage)
