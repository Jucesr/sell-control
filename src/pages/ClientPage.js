import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Formik} from 'formik'
import Yup from 'yup'

import Form from '../components/FormClient'
import {addClient, fetchClients} from '../actions/clients'

const require_message = 'This field is required'

class ClientPage extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      active_page: 'list',
    }
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
          <button className={this.state.active_page == 'modify' ? 'ClientPage__button_page_active' : 'ClientPage__button_page'} id="modify" onClick={this.togglePage}>Modify</button>
          <button className={this.state.active_page == 'delete' ? 'ClientPage__button_page_active' : 'ClientPage__button_page'} id="delete" onClick={this.togglePage}>Delete</button>
        </div>

        <div className="ClientPage__content">

          { this.state.active_page == 'list' &&
            <ListPage
              clients={this.props.clients}
              fetchClients={this.props.fetchClients}
            />
          }

          { this.state.active_page == 'new' && <NewPage onSubmit={this.props.addClient}/>}

          { this.state.active_page == 'modify' && <ModifyPage/>}

          { this.state.active_page == 'delete' && <DeletePage/>}

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  clients: state.clients.items
})

const mapDispatchToProps = dispatch => ({
  addClient: client => dispatch(addClient(client)),
  fetchClients: () => dispatch(fetchClients())
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientPage)


const ListPage = ({clients, fetchClients}) => (
  <div>
    {clients.length > 0 ? clients.map(({fist_name, last_name, address, email, phone}) =>
      <div key={fist_name}>
        <span>{fist_name}</span>
        <span>{last_name}</span>
        <span>{address}</span>
        <span>{email}</span>
        <span>{phone}</span>
      </div>) : 'No Clients'}

      <button onClick={fetchClients}>Fetch client</button>
  </div>
)

const NewPage = ({onSubmit}) => (
  <Form
    fields={{
      fist_name: '',
      last_name: '',
      address: '',
      email: '',
      phone: ''
    }}
    validationObject={Yup.object().shape({
      fist_name: Yup.string().required(require_message),
      last_name: Yup.string(),
      address: Yup.string().max(40),
      email: Yup.string().email().required(require_message),
      phone: Yup.string().min(8)
    })}
    onSubmit={(props) => onSubmit(props)}/>
)

const ModifyPage = () => (
  <div>List</div>
)

const DeletePage = () => (
  <div>List</div>
)

NewPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

ListPage.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      // id: PropTypes.string.isRequired,
      fist_name: PropTypes.string.isRequired,
      last_name: PropTypes.string,
      address: PropTypes.string,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
    }).isRequired
  ).isRequired,
}
