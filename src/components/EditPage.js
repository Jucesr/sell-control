import React from 'react'
import Form from '../components/CustomForm'
import PropTypes from 'prop-types'
import Yup from 'yup'

const require_message = 'This field is required';
const invalid_email = 'Invalid email';

export const EditPage = ({onSubmit, onSearch, onCancel, defaults}) => (
  <div>
    <Form
      fields={{
        email: ''
      }}
      cancelButton={false}
      disabledForm={defaults.hasOwnProperty('_id')}
      textSubmitButton="Search"
      validationObject={Yup.object().shape({
        email: Yup.string().email(invalid_email).required(require_message)
      })}
      onSubmit={(props) => {
        onSearch(props).then(
          null,
          e => alert(e)
        );
      }}

    />
    { defaults.hasOwnProperty('_id') && <Form
      textSubmitButton="Save"
      onCancel={onCancel}
      fields={{
        fist_name: defaults.fist_name,
        last_name: defaults.last_name,
        address: defaults.address,
        email: defaults.email,
        phone: defaults.phone
      }}
      validationObject={Yup.object().shape({
        fist_name: Yup.string().required(require_message),
        last_name: Yup.string(),
        address: Yup.string().max(40),
        email: Yup.string().email().required(require_message),
        phone: Yup.string().min(8)
      })}
      onSubmit={(props) => {
        onSubmit(props).then(
          () => alert('Client saved'),
          e => alert(e)
        );
      }}/>}
  </div>

)
