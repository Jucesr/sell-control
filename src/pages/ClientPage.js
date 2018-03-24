import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {NewPage} from '../components/NewPage'
import {ListPage} from '../components/ListPage'
import {EditPage} from '../components/EditPage'
import {addClient, fetchClients} from '../actions/clients'

class ClientPage extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      active_page: 'list',
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

  render(){

    return (
      <div>
        <h2>Clients</h2>
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
            />
          }

          { this.state.active_page == 'new' && <NewPage onSubmit={this.props.addClient}/>}

          { this.state.active_page == 'edit' && <EditPage/>}


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
  fetchClients: () => dispatch(fetchClients())
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientPage)
