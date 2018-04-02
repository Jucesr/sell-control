import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Yup from 'yup'

import {NewPage} from '../components/NewPage'
import {ListPage} from '../components/ListPage'
import {EditPage} from '../components/EditPage'
import {addClient, fetchClients, updateClient, removeClient} from '../actions/clients'

class ClientPage extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      active_page: 'new',
      clientToEdit: {
        fist_name: '',
        last_name: '',
        address: '',
        email: '',
        phone: ''
      }
    }
  }

  componentDidMount() {
    this.props.fetchClients();
  }

  changePage = (e) => {
    let page = e.target.id
    this.setState(() => ({
      active_page: page
    }))
  }

  onSearch = ({email}, resetForm, setErrors) => {
    const client = this.props.clients.filter(client => client.email == email)[0];

    if(client){
      this.setState(() => ({
          clientToEdit: client
      }))
    }else{
      //TODO: Search in Database.
      setErrors({email: 'Client was not found'})
    }

  }

  onAdd = (client, resetForm, setErrors) => {
    const search = this.props.clients.filter((item) => item.email == client.email)
    if(search.length == 0){
      this.props.addClient(client).then(
        () => {
          alert('Client added')
        }
      ).catch(
        e => alert(e)
      ).then(resetForm)
    }else{
      setErrors({email: 'The email is alredy taken'})
    }

  }

  onDelete = (client) => {

    client = {
      ...client,
      _id: this.state.clientToEdit._id
    }

    this.props.removeClient(client).then(
      () => alert('Client deleted'),
      e => alert(e)
    ).then(() => this.onCancelEdit());

  }

  onEdit = (updatedClient, resetForm, setErrors) => {

    updatedClient = {
      ...updatedClient,
      _id: this.state.clientToEdit._id
    }

    const search = this.props.clients.filter((item) => (item.email == updatedClient.email && item._id != updatedClient._id));

    if(search.length == 0){
      this.props.updateClient(updatedClient).then(
        () => {
          alert('Client saved');
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
        clientToEdit: {
          fist_name: '',
          last_name: '',
          address: '',
          email: '',
          phone: ''
        }
    }));
  }

  onClickItemTable = (client) => {
    this.setState(() => ({
        clientToEdit: client,
        active_page: 'edit'
    }))
  }

  render(){

    const require_message = 'This field is required';
    const {clientToEdit} = this.state;

    return (
      <div className ={`Page ${this.props.sidebar_open ? 'Page__open': 'Page__closed'}`}>
        <div className= 'Page__title'><h2> Clients </h2></div>

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
                ]}
                items={this.props.clients}
                loading={this.props.isFetching}
                onClickItemTable={this.onClickItemTable}
              />
            }

            { this.state.active_page == 'new' &&
              <NewPage
                formFields={{
                  fist_name: '',
                  last_name: '',
                  address: '',
                  email: '',
                  phone: ''
                }}
                onAdd={this.onAdd}
                validationSchema={Yup.object().shape({
                  fist_name: Yup.string().required(require_message),
                  last_name: Yup.string(),
                  address: Yup.string().max(40),
                  email: Yup.string().email().required(require_message),
                  phone: Yup.string().min(8)
                })}
              />
            }

            { this.state.active_page == 'edit' &&
              <EditPage
                editForm={{
                  fields: {
                    fist_name: clientToEdit.fist_name,
                    last_name: clientToEdit.last_name,
                    address: clientToEdit.address,
                    email: clientToEdit.email,
                    phone: clientToEdit.phone
                  },
                  validationSchema: Yup.object().shape({
                    fist_name: Yup.string().required(require_message),
                    last_name: Yup.string(),
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
                disabledForm={clientToEdit.hasOwnProperty('_id')}
              />
            }
          </div>
        </div>
      </div>
    )
  }
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
