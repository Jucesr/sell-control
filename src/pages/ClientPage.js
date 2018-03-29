import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {NewPage} from '../components/NewPage'
import {ListPage} from '../components/ListPage'
import {EditPage} from '../components/EditPage'
import {addClient, fetchClients, updateClient, removeClient} from '../actions/clients'

class ClientPage extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      active_page: 'list',
      edit_client: {
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

  togglePage = (e) => {
    let page = e.target.id
    this.setState(() => ({
      active_page: page
    }))
  }

  onSearch = ({email}) => {
    const client = this.props.clients.filter(client => client.email == email)[0];

    return new Promise((resolve, reject) => {
      if(client){
        this.setState(() => ({
            edit_client: client
        }), resolve())
      }else{
        //TODO: Search in Database.
        reject('Client was not found');
      }
    });
  }

  onAddClient = (client, resetForm, setErrors) => {
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

  onEditClient = (updatedClient, resetForm, setErrors) => {

    updatedClient = {
      ...updatedClient,
      _id: this.state.edit_client._id
    }
    this.props.updateClient(updatedClient).then(
      () => {
        alert('Client saved');
        this.onCancelEdit();
      },
      e => alert(e)
    )
  }

  onCancelEdit = () => {
    this.setState(() => ({
        edit_client: {
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
        edit_client: client,
        active_page: 'edit'
    }))
  }

  setStateProm = (newState) => {
    return new Promise((resolve) => {
      this.setState(newState, resolve())
    });
  }

  render(){

    return (
      <div className = "ClientPage">
        <h2 className= 'ClientPage__title'>Clients</h2>
        <div className="ClientPage__actions">
          <button className={this.state.active_page == 'list' ? 'ClientPage__button_page_active' : 'ClientPage__button_page'} id="list" onClick={this.togglePage}>List</button>
          <button className={this.state.active_page == 'new' ? 'ClientPage__button_page_active' : 'ClientPage__button_page'} id="new" onClick={this.togglePage}>New</button>
          <button className={this.state.active_page == 'edit' ? 'ClientPage__button_page_active' : 'ClientPage__button_page'} id="edit" onClick={this.togglePage}>Edit</button>
        </div>

        <div className="ClientPage__content">

          { this.state.active_page == 'list' &&
            <ListPage
              clients={this.props.clients}
              fetchClients={this.props.fetchClients}
              isFetching={this.props.isFetching}
              onClickItemTable={this.onClickItemTable}
            />
          }

          { this.state.active_page == 'new' &&
            <NewPage
              onSubmit={this.onAddClient}
            />
          }

          { this.state.active_page == 'edit' &&
            <EditPage
              defaults={this.state.edit_client}
              onSubmit={this.onEditClient}
              onDelete={this.props.removeClient}
              onCancel={this.onCancelEdit}
              onSearch={this.onSearch}
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  clients: state.clients.items,
  isFetching: state.clients.isFetching
})

const mapDispatchToProps = dispatch => ({
  addClient: client => dispatch(addClient(client)),
  updateClient: client => dispatch(updateClient(client)),
  removeClient: id => dispatch(removeClient(id)),
  fetchClients: () => dispatch(fetchClients())
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientPage)
