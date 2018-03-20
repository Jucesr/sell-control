import React from 'react';
import {Formik} from 'formik';
import Yup from 'yup';
import Form from '../components/FormClient';

const require_message = 'This field is required';

export default class ClientPage extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      active_page: 'list',
    }
  }

  togglePage = (e) => {
    let page = e.target.id;
    this.setState(() => ({
      active_page: page
    }));
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

          { this.state.active_page == 'list' && <ListPage/>}

          { this.state.active_page == 'new' && <NewPage/>}

          { this.state.active_page == 'modify' && <ModifyPage/>}

          { this.state.active_page == 'delete' && <DeletePage/>}

        </div>
      </div>
    )
  }
}

const ListPage = () => (
  <div>List</div>
)

const NewPage = () => (
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
    onSubmit={(props) => console.log(props)}/>
)

const ModifyPage = () => (
  <div>List</div>
)

const DeletePage = () => (
  <div>List</div>
)
